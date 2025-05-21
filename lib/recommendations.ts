import { bookmarks, categories, db, toolCategories, tools, usageLogs, users } from './db';
import { eq, and, desc, sql } from 'drizzle-orm';

/**
 * Recommendation algorithm for Promptly AI
 * 
 * This algorithm recommends tools based on:
 * 1. User's reference category (highest weight)
 * 2. Previously used tools (medium weight)
 * 3. Bookmarked tools (medium weight)
 * 4. Popularity among similar users (low weight)
 * 5. New tools in preferred categories (low weight)
 * 
 * The algorithm uses a scoring system to rank tools and returns
 * the top N recommendations.
 */

export async function getRecommendedTools(userId: string, limit: number = 6) {
  // Step 1: Get user's reference category
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });
  
  if (!user) return [];
  
  // Step 2: Calculate various signals for recommendations
  
  // 2.1: Get categories related to user's reference
  const userReferenceCategory = user.reference
    ? await db.query.categories.findFirst({
        where: eq(categories.name, user.reference)
      })
    : null;
  
  // 2.2: Get user's previously used tools (ordered by recency and frequency)
  const userToolUsage = await db
  .select({
    toolId: usageLogs.toolId,
    useCount: sql<number>`count(*)`,
    lastUsed: sql<Date>`max(${usageLogs.timestamp})`
  })
  .from(usageLogs)
  .where(eq(usageLogs.userId, userId))
  .groupBy(usageLogs.toolId)
  .orderBy(desc(sql`max(${usageLogs.timestamp})`));
  
  // 2.3: Get user's bookmarked tools
  const userBookmarks = await db
    .select({ toolId: bookmarks.toolId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId));
  
  // 2.4: Get popular tools among users with the same reference
  const popularToolsInReference = user.reference
    ? await db
        .select({
          toolId: usageLogs.toolId,
          useCount: sql<number>`count(distinct ${usageLogs.userId})`
        })
        .from(usageLogs)
        .innerJoin(users, eq(usageLogs.userId, users.id))
        .where(eq(users.reference, user.reference))
        .groupBy(usageLogs.toolId)
        .orderBy(desc(sql`count(distinct ${usageLogs.userId})`))
        .limit(20)
    : [];
  
  // 2.5: Get new tools in user's preferred categories
  const newToolsInPreferredCategories = await db
    .select({ toolId: tools.id })
    .from(tools)
    .innerJoin(toolCategories, eq(tools.id, toolCategories.toolId))
    .innerJoin(categories, eq(toolCategories.categoryId, categories.id))
    .where(and(
      eq(categories.name, user.reference!),
      eq(tools.isNew, true)
    ))
    .limit(10);
  
  // Step 3: Assign scores to each tool based on different signals
  // Create a map to store tool scores
  const toolScores: Record<string, number> = {};
  
  // Score: Reference category match (weight: 50)
  if (userReferenceCategory) {
    const toolsInReference = await db
      .select({ toolId: toolCategories.toolId })
      .from(toolCategories)
      .where(eq(toolCategories.categoryId, userReferenceCategory.id));
    
    for (const tool of toolsInReference) {
      toolScores[tool.toolId] = (toolScores[tool.toolId] || 0) + 50;
    }
  }
  
  // Score: Previously used tools (weight: 30 + recency boost)
  for (const [index, usage] of userToolUsage.entries()) {
    // Add recency boost (more recent = higher score)
    const recencyBoost = Math.max(10 - index, 0); // Max 10 points for recency
    toolScores[usage.toolId] = (toolScores[usage.toolId] || 0) + 30 + recencyBoost;
  }
  
  // Score: Bookmarked tools (weight: 25)
  for (const bookmark of userBookmarks) {
    toolScores[bookmark.toolId] = (toolScores[bookmark.toolId] || 0) + 25;
  }
  
  // Score: Popular among similar users (weight: 15)
  for (const popular of popularToolsInReference) {
    toolScores[popular.toolId] = (toolScores[popular.toolId] || 0) + 15;
  }
  
  // Score: New tools in preferred categories (weight: 20)
  for (const newTool of newToolsInPreferredCategories) {
    toolScores[newTool.toolId] = (toolScores[newTool.toolId] || 0) + 20;
  }
  
  // Step 4: Sort tools by score and get top N
  const sortedToolIds = Object.entries(toolScores)
    .sort((a, b) => b[1] - a[1]) // Sort by score (descending)
    .slice(0, limit) // Take only the top N tools
    .map(entry => entry[0]); // Extract tool IDs
  
  // Step 5: Fetch full tool details for the recommendations
  if (sortedToolIds.length === 0) {
    // Fallback: if no personalized recommendations, return newest tools
    return await db.query.tools.findMany({
      orderBy: [desc(tools.createdAt)],
      limit
    });
  }
  
  // Get full details of recommended tools
  const recommendedTools = [];
  for (const toolId of sortedToolIds) {
    const tool = await db.query.tools.findFirst({
      where: eq(tools.id, toolId),
      with: {
        categories: {
          with: {
            category: true
          }
        }
      }
    });
    
    if (tool) recommendedTools.push(tool);
  }
  
  return recommendedTools;
}
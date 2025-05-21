import { db, toolCategories, tools, categories, users } from './db';
import { eq, inArray, desc } from 'drizzle-orm';

/**
 * Recommendation algorithm for Promptly AI
 * 
 * Groups recommended tools under each of the user's selected reference categories.
 */

export async function getRecommendedTools(userId: string, limitPerCategory: number = 6) {
  // Step 1: Get user's references (as an array)
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });

  if (!user || !user.reference) return [];

  let references: string[] = [];
  try {
    references = JSON.parse(user.reference);
    if (!Array.isArray(references)) references = [user.reference];
  } catch {
    references = [user.reference];
  }

  // Step 2: Find all categories matching any of the user's references
  const matchedCategories = await db
    .select()
    .from(categories)
    .where(inArray(categories.name, references));

  if (!matchedCategories.length) return [];
  
  // Step 3: For each category, fetch tools in that category
  const result = [];
  for (const category of matchedCategories) {
    // Find tool IDs for this category
    const toolsInCategory = await db
      .select({ toolId: toolCategories.toolId })
      .from(toolCategories)
      .where(eq(toolCategories.categoryId, category.id));

    const toolIds = toolsInCategory.map(tc => tc.toolId);
    if (!toolIds.length) continue;

    // Fetch tool details, sorted by newest
    const categoryTools = await db.query.tools.findMany({
      where: inArray(tools.id, toolIds),
      orderBy: [desc(tools.createdAt)],
      limit: limitPerCategory,
      with: {
        categories: {
          with: {
            category: true
          }
        }
      }
    });

    result.push({
      category,
      tools: categoryTools
    });
  }

  return result; // [{ category, tools: [...] }, ...]
}
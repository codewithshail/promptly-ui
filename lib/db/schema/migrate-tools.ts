import { db } from '@/lib/db'; // Assuming this is your Drizzle ORM database instance
import { categories, tools, toolCategories } from '@/lib/db'; // Adjust the import path based on your project structure
import { toolCategories as toolCategoriesData } from '@/data/tool-categories';

// Step 1: Insert Categories
const insertCategories = async () => {
  const categoryData = toolCategoriesData.map(category => ({
    id: category.id,
    name: category.title,
    description: category.description,
    icon: category.icon.name, // Store the icon name as a string (e.g., "Briefcase")
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(categories).values(categoryData).onConflictDoNothing();
};

// Step 2: Insert Unique Tools
const insertTools = async () => {
  // Collect all unique tools
  const allTools = Array.from(new Map(
    toolCategoriesData.flatMap(category => 
      category.tools.map(tool => [
        tool.name, // Use name as the unique key
        tool
      ])
    )
  ).values());

  const toolData = allTools.map((tool, index) => ({
    id: `tool_${index + 1}`, // Generate a simple unique ID
    name: tool.name,
    description: tool.description || "A tool for various purposes", // Use provided description or default
    subtitle: tool.subtitle || null,
    logo: tool.logo || "https://default-logo.com/placeholder.png", // Use provided logo or default
    screenshots: tool.screenshots || null,
    priceInfo: tool.priceInfo || null,
    generationType: tool.generationType || "unknown", // Use provided generationType or default
    isNew: tool.isNew ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(tools).values(toolData).onConflictDoNothing();
};

// Step 3: Insert Tool-Category Relationships
const insertToolCategories = async () => {
  // First, fetch all tools to map names to IDs
  const allTools = await db.select().from(tools);
  
  const toolCategoryData = toolCategoriesData.flatMap(category => 
    category.tools.map(tool => {
      const toolRecord = allTools.find(t => t.name === tool.name);
      if (!toolRecord) return null;
      return {
        toolId: toolRecord.id,
        categoryId: category.id,
      };
    }).filter(item => item !== null)
  );

  await db.insert(toolCategories).values(toolCategoryData).onConflictDoNothing();
};

// Run the migration
const migrate = async () => {
  try {
    console.log("Starting migration...");
    await insertCategories();
    console.log("Categories inserted.");
    await insertTools();
    console.log("Tools inserted.");
    await insertToolCategories();
    console.log("Tool-Category relationships inserted.");
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

// Execute the migration
migrate().catch(err => {
  console.error("Error during migration:", err);
  process.exit(1);
});
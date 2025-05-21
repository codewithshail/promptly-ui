import { auth } from "@clerk/nextjs/server";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRecommendedTools } from "@/lib/recommendations";
import { db } from "@/lib/db";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolGrid } from "@/components/tools/tool-grid";
import { WhatsNew } from "@/components/dashboard/whats-new";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  // Fetch user data
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  // Fetch recommended tools
  const recommendedTools = await getRecommendedTools(userId, 6);

  // Fetch new tools
  const newTools = await db.query.tools.findMany({
    where: (tools, { eq }) => eq(tools.isNew, true),
    limit: 6,
  });

  // Fetch recent tools
  const recentTools = await db.query.usageLogs.findMany({
    where: (usageLogs, { eq }) => eq(usageLogs.userId, userId),
    orderBy: (usageLogs, { desc }) => [desc(usageLogs.timestamp)],
    limit: 6,
    with: {
      tool: true,
    },
  });

  // Get unique tools from usage logs
  const uniqueRecentTools = Array.from(
    new Map(recentTools.map((log) => [log.tool.id, log.tool])).values()
  );

  // Fetch bookmarked tools
  const bookmarkedTools = await db.query.bookmarks.findMany({
    where: (bookmarks, { eq }) => eq(bookmarks.userId, userId),
    limit: 6,
    with: {
      tool: true,
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search for AI tools..." className="pl-10" />
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recommended Tools</h2>
          <Button variant="link" asChild>
            <a href="/apps">See all</a>
          </Button>
        </div>
        <ToolGrid>
          {recommendedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </ToolGrid>
      </section>

      <section>
        <div className="flex flex-col mb-4">
          <h2 className="text-2xl font-bold mb-6">What's New</h2>
          <div className="w-full">
            <WhatsNew cardsData={newTools} />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recently Used Tools</h2>
          <Button variant="link" asChild>
            <a href="/apps">See all</a>
          </Button>
        </div>
        {uniqueRecentTools.length > 0 ? (
          <ToolGrid>
            {uniqueRecentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </ToolGrid>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't used any tools yet
              </p>
              <Button asChild>
                <a href="/apps">Explore Tools</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Bookmarked Tools</h2>
          <Button variant="link" asChild>
            <a href="/bookmarks">See all</a>
          </Button>
        </div>
        {bookmarkedTools.length > 0 ? (
          <ToolGrid>
            {bookmarkedTools.map((bookmark) => (
              <ToolCard key={bookmark.tool.id} tool={bookmark.tool} />
            ))}
          </ToolGrid>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't bookmarked any tools yet
              </p>
              <Button asChild>
                <a href="/apps">Explore Tools</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

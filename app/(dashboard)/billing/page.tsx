import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

export default async function BillingPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/login')
  }
  
  // Fetch usage logs
  const usageLogs = await db.query.usageLogs.findMany({
    where: (usageLogs, { eq }) => eq(usageLogs.userId, userId),
    orderBy: (usageLogs, { desc }) => [desc(usageLogs.timestamp)],
    with: {
      tool: true
    }
  })
  
  // Calculate total cost
  const totalCost = usageLogs.reduce((sum, log) => {
    return sum + Number(log.cost)
  }, 0)
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          View your usage and billing information.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime usage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tools Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(usageLogs.map(log => log.toolId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique tools
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageLogs.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Tool executions
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
          <CardDescription>
            A detailed log of your tool usage and associated costs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usageLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Tool</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                    <th className="text-right py-3 px-4 font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {usageLogs.map(log => (
                    <tr key={log.id} className="border-b">
                      <td className="py-3 px-4">{log.tool.name}</td>
                      <td className="py-3 px-4">{log.tool.generationType}</td>
                      <td className="py-3 px-4">{log.quantity.toString()}</td>
                      <td className="py-3 px-4">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </td>
                      <td className="py-3 px-4 text-right">${Number(log.cost).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No usage history yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
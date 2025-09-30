import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Feature</CardTitle>
          <CardDescription>
            This section will display all registered customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">The customer management page is currently under construction.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

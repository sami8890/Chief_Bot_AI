import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Feature</CardTitle>
          <CardDescription>
            This section will display all customer orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">The order management page is currently under construction.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

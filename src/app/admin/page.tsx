
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils, Users, ShoppingCart } from "lucide-react";
import { menuItems } from "@/lib/data";

export default function AdminDashboardPage() {
  // In a real app, you'd fetch this data
  const totalMenuItems = menuItems.length;
  const totalOrders = 0; // Placeholder
  const totalCustomers = 0; // Placeholder

  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Menu Items
                    </CardTitle>
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalMenuItems}</div>
                    <p className="text-xs text-muted-foreground">
                        Dishes available for customers
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Today's Orders
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        New orders placed today
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Customers
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">
                        New customer sign-ups
                    </p>
                </CardContent>
            </Card>
        </div>
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No recent activity to display.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

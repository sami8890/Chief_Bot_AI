
'use client';

import { useState } from 'react';
import { orders as initialOrders, type Order } from '@/lib/data';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const statusColors: { [key: string]: string } = {
    Pending: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    Confirmed: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    Delivered: 'bg-green-500/20 text-green-700 border-green-500/30',
    Cancelled: 'bg-red-500/20 text-red-700 border-red-500/30'
};

const orderStatuses = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'] as const;

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const { toast } = useToast();

    const updateOrderStatus = (orderId: number, status: Order['status']) => {
        setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));
        toast({
            title: "Order Updated",
            description: `Order #${orderId} has been marked as ${status}.`
        })
    }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Customer Orders</CardTitle>
          <CardDescription>
            View and manage all incoming orders here.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell className="hidden md:table-cell">{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn("capitalize border", statusColors[order.status])}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                        {orderStatuses.map(status => (
                                            <DropdownMenuItem key={status} onClick={() => updateOrderStatus(order.id, status)}>
                                                {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

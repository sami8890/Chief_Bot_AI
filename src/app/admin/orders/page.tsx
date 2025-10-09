
'use client';

import { useState, useEffect } from 'react';
import { type Order } from '@/lib/data';
import { useFirestore } from '@/firebase';
import { collection, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Loader2 } from 'lucide-react';
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
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

const statusColors: { [key: string]: string } = {
    Pending: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    Confirmed: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    Delivered: 'bg-green-500/20 text-green-700 border-green-500/30',
    Cancelled: 'bg-red-500/20 text-red-700 border-red-500/30'
};

const orderStatuses = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'] as const;

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const firestore = useFirestore();

    useEffect(() => {
        if (!firestore) return;
        const ordersQuery = query(collection(firestore, "orders"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const fetchedOrders: Order[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Order, 'id'>)
            }));
            setOrders(fetchedOrders);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            const contextualError = new FirestorePermissionError({
              operation: 'list',
              path: 'orders',
            });
            errorEmitter.emit('permission-error', contextualError);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch orders.'});
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [firestore, toast]);


    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        if (!firestore) return;
        const orderRef = doc(firestore, "orders", orderId);
        updateDoc(orderRef, { status })
            .then(() => {
                toast({
                    title: "Order Updated",
                    description: `Order #${orderId.substring(0,6)}... has been marked as ${status}.`
                })
            })
            .catch(error => {
                console.error("Error updating order status:", error);
                const contextualError = new FirestorePermissionError({
                  operation: 'update',
                  path: orderRef.path,
                  requestResourceData: { status }
                });
                errorEmitter.emit('permission-error', contextualError);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to update order status.'});
            });
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
             {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
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
                                <TableCell className="font-medium">#{order.id.substring(0, 6)}...</TableCell>
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
            )}
            { !isLoading && orders.length === 0 && <p className="text-center text-muted-foreground p-8">No orders have been placed yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

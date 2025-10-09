
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Utensils, Users, ShoppingCart, DollarSign, Loader2 } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { Order, Customer } from '@/lib/data';
import { SalesChart } from '@/components/admin/sales-chart';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, subDays } from 'date-fns';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ordersQuery = query(collection(db, "orders"), orderBy("date", "desc"));
    const usersQuery = query(collection(db, "users"), orderBy("joinedDate", "desc"));
    const menuItemsRef = collection(db, "menu_items");

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(fetchedOrders);
      if(!isLoading) setIsLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
    });

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const fetchedCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      setCustomers(fetchedCustomers);
    }, (error) => {
      console.error("Error fetching customers:", error);
    });
    
    const unsubscribeMenuItems = onSnapshot(menuItemsRef, (snapshot) => {
        setMenuItemCount(snapshot.size);
        if(isLoading) setIsLoading(false);
    }, (error) => {
        console.error("Error fetching menu items:", error);
        if(isLoading) setIsLoading(false);
    })


    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeMenuItems();
    };
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const recentOrders = orders.slice(0, 5);

  const salesData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), i);
    const dateString = format(date, 'MMM d');
    const total = orders
      .filter(order => format(new Date(order.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
      .reduce((sum, order) => sum + order.total, 0);
    return { name: dateString, total: total };
  }).reverse();

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    )
  }

  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">from {totalOrders} orders</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">All-time customer orders</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">New customer sign-ups</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{menuItemCount}</div>
                    <p className="text-xs text-muted-foreground">Dishes available for customers</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Revenue from the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart data={salesData} />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>The 5 most recent orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                    {recentOrders.map(order => (
                        <div key={order.id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                           <AvatarFallback>{order.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                        <div className="ml-auto font-medium">${order.total.toFixed(2)}</div>
                        </div>
                    ))}
                    </div>
                ) : (
                     <p className="text-muted-foreground text-center">No recent orders to display.</p>
                )}
              </CardContent>
            </Card>
        </div>
    </div>
  );
}

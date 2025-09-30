
'use client';

import { useState, useEffect } from 'react';
import { type Customer } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function UsersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const usersRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const fetchedCustomers: Customer[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Customer, 'id'>)
            }));
            fetchedCustomers.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
            setCustomers(fetchedCustomers);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch customers.' });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Customers</CardTitle>
          <CardDescription>
            A list of all users who have created an account.
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
                            <TableHead>Customer</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">Joined On</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{customer.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell className="hidden md:table-cell">{new Date(customer.joinedDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {customer.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
                                        <Badge>Admin</Badge>
                                    ) : (
                                        <Badge variant="secondary">Customer</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
             { !isLoading && customers.length === 0 && <p className="text-center text-muted-foreground p-8">No customers have signed up yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

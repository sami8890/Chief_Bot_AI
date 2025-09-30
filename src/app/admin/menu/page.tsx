
'use client';

import { useState } from 'react';
import { menuItems as initialMenuItems, type MenuItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MenuAdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="hidden md:table-cell">Tags</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="hidden sm:table-cell">
                                    {/* Placeholder for image */}
                                    <div className="h-12 w-12 bg-muted rounded-md"></div>
                                </TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <div className="flex gap-1 flex-wrap">
                                        {item.dietaryTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                    </div>
                                </TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

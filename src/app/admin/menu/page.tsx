
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { menuItems as initialMenuItems, dietaryOptions, categories, type MenuItem } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Trash2, FileEdit, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const menuItemSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().positive('Price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    dietaryTags: z.array(z.string()).optional(),
    imageId: z.string().min(1, 'Image is required'),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export default function MenuAdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
        name: '',
        description: '',
        price: 0,
        category: '',
        dietaryTags: [],
        imageId: ''
    }
  });

  const handleAddNew = () => {
    setEditingItem(null);
    form.reset({
        name: '',
        description: '',
        price: 0,
        category: '',
        dietaryTags: [],
        imageId: ''
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    form.reset(item);
    setIsFormOpen(true);
  };

  const handleDeleteConfirmation = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    setMenuItems(menuItems.filter(item => item.id !== itemToDelete.id));
    toast({ title: "Success", description: "Menu item deleted." });
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const onSubmit = (data: MenuItemFormValues) => {
    if (editingItem) {
      // Edit
      const updatedItems = menuItems.map(item => item.id === editingItem.id ? { ...editingItem, ...data } : item);
      setMenuItems(updatedItems);
      toast({ title: "Success", description: "Menu item updated." });
    } else {
      // Add
      const newItem: MenuItem = {
        id: Math.max(...menuItems.map(i => i.id), 0) + 1,
        ...data,
      };
      setMenuItems([...menuItems, newItem]);
      toast({ title: "Success", description: "Menu item added." });
    }
    setIsFormOpen(false);
    setEditingItem(null);
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Menu Items</CardTitle>
                <CardDescription>Manage your restaurant's menu here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="hidden md:table-cell">Tags</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        src={PlaceHolderImages.find(p => p.id === item.imageId)?.imageUrl || 'https://placehold.co/100x100'}
                                        alt={item.name}
                                        width={64}
                                        height={64}
                                        className="rounded-md object-cover w-16 h-16"
                                    />
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
                                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                <FileEdit className="mr-2"/>Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteConfirmation(item)}>
                                                <Trash2 className="mr-2"/>Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[625px] grid-rows-[auto_1fr_auto] p-0 max-h-[90vh]">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                    <DialogDescription>
                        {editingItem ? 'Update the details of your menu item.' : 'Fill in the details for the new menu item.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-y-auto">
                        <div className="grid gap-4 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="price" render={({ field }) => (
                                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="category" render={({ field }) => (
                                    <FormItem><FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="imageId" render={({ field }) => (
                                <FormItem><FormLabel>Image</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select an image" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {PlaceHolderImages.map(img => <SelectItem key={img.id} value={img.id}>{img.id}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="dietaryTags" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dietary Tags</FormLabel>
                                    <div className="grid grid-cols-2 gap-2">
                                        {dietaryOptions.map((option) => (
                                            <FormField
                                                key={option}
                                                control={form.control}
                                                name="dietaryTags"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem key={option} className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(option)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                    ? field.onChange([...(field.value || []), option])
                                                                    : field.onChange(field.value?.filter((value) => value !== option))
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal capitalize">{option.replace('-', ' ')}</FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        
                        <DialogFooter className="p-6 pt-0 sticky bottom-0 bg-background border-t">
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                                {editingItem ? 'Save Changes' : 'Add Item'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
         <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the menu item
                        &quot;{itemToDelete?.name}&quot;.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

    
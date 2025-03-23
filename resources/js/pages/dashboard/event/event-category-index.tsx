// resources/js/Pages/EventCategories/Index.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import CreateCategoryForm from './create-category-form';
import { BreadcrumbItem } from '@/types';

interface Category {
  id: number;
  name: string;
}

interface IndexProps {
  categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Event Categories',
    href: '/dashboard/event-categories',
  },
];

export default function Index({ categories }: IndexProps) {
  const { delete: destroy } = useForm();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = React.useState<number | null>(null);

  const handleDeleteCategory = () => {
    if (categoryIdToDelete) {
      destroy(route('event-categories.destroy', categoryIdToDelete));
      setDeleteDialogOpen(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Event Categories" />
      <div className="flex flex-1 flex-col h-full p-4 rounded-xl gap-4">
        {/* Create Category Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="w-fit mb-4">
              Create Category
            </Button>
          </DialogTrigger>
          <CreateCategoryForm />
        </Dialog>

        {/* List of Categories */}
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="flex border justify-between p-2 rounded-md items-center">
              <span>{category.name}</span>

              {/* Delete Dialog Trigger */}
              <Dialog
                open={deleteDialogOpen && categoryIdToDelete === category.id}
                onOpenChange={(open) => {
                  setDeleteDialogOpen(open);
                  if (!open) setCategoryIdToDelete(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setCategoryIdToDelete(category.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </DialogTrigger>

                {/* Confirmation Dialog Content */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      This will permanently delete the category and all associated events.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteCategory}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
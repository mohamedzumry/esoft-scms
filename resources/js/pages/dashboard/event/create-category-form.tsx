import React from 'react';
import { useForm } from '@inertiajs/react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Define the FormData interface
interface FormData {
  name: string;
  // Add an index signature to allow dynamic key access
  [key: string]: string;
}

interface CreateCategoryProps {
  isOpen: boolean; // Controls whether the dialog is open
  onClose: () => void; // Function to close the dialog
}

export default function CreateCategoryForm() {
  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    name: '', // Name of the category
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('event-categories.store'), {
      onSuccess: () => {
        reset(); // Reset form after successful submission
      },
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]" >
      <DialogHeader>
        <DialogTitle>Create Event Category</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Name */}
        <div>
          <Label htmlFor="name" className="text-sm block font-medium">
            Category Name
          </Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder="Enter category name"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={processing}>
            {processing ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
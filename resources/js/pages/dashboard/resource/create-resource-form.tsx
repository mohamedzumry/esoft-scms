import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

export default function CreateResourceForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: '',
        description: '',
        capacity: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('resources.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    required
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    required
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div>
                <Label htmlFor="capacity">Capacity (optional)</Label>
                <Input
                    id="capacity"
                    type="number"
                    value={data.capacity}
                    onChange={(e) => setData('capacity', e.target.value)}
                />
                {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Resource'}
            </Button>
        </form>
    );
}
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Course {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    moduleId: number;
    courses: Course[];
}

export default function AssignModuleToCoursesDialog({ open, onClose, moduleId, courses }: Props) {
    const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingAssigned, setLoadingAssigned] = useState<boolean>(false);

    // Fetch the currently assigned courses when the dialog opens
    useEffect(() => {
        if (open) {
            setLoadingAssigned(true);
            fetch(`/dashboard/modules/${moduleId}/courses`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                },
            })
                .then((response) => response.json())
                .then((data) => setSelectedCourses(data))
                .catch((error) => {
                    console.error("Failed to fetch assigned courses:", error);
                    toast.error("Failed to load assigned courses");
                })
                .finally(() => setLoadingAssigned(false));
        }
    }, [open, moduleId]);

    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssign = () => {
        if (selectedCourses.length === 0) {
            toast.error("Please select at least one course");
            return;
        }

        router.post(`/dashboard/modules/${moduleId}/courses`, {
            course_ids: selectedCourses,
        }, {
            onSuccess: () => {
                toast.success("Module assigned to courses successfully");
                setSearchQuery("");
                onClose();
            },
            onError: () => toast.error("Failed to assign module to courses"),
        });
    };

    const toggleCourse = (courseId: number) => {
        setSelectedCourses((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Module to Courses</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Search Courses</label>
                        <Input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {loadingAssigned ? (
                            <p className="text-gray-500 text-center">Loading assigned courses...</p>
                        ) : filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <div key={course.id} className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedCourses.includes(course.id)}
                                        onChange={() => toggleCourse(course.id)}
                                    />
                                    <span className="ml-2">{course.name}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No courses found</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAssign} disabled={selectedCourses.length === 0}>
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
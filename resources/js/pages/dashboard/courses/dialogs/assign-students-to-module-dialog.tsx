import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface User {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    moduleId: number;
    students: User[];
}

export default function AssignStudentsToModuleDialog({ open, onClose, moduleId, students }: Props) {
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [assignedStudents, setAssignedStudents] = useState<number[]>([]);
    const [loadingAssigned, setLoadingAssigned] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setLoadingAssigned(true);
            fetch(`/dashboard/modules/${moduleId}/students`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                },
            })
                .then((response) => response.json())
                .then((data) => setAssignedStudents(data))
                .catch((error) => {
                    console.error("Failed to fetch assigned students:", error);
                    toast.error("Failed to load assigned students");
                })
                .finally(() => setLoadingAssigned(false));
        }
    }, [open, moduleId]);

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssign = () => {
        router.post(`/dashboard/modules/${moduleId}/students`, {
            student_ids: selectedStudents,
        }, {
            onSuccess: () => {
                toast.success("Students assigned to module successfully");
                setSelectedStudents([]);
                setSearchQuery("");
                setAssignedStudents([]);
                onClose();
            },
            onError: () => toast.error("Failed to assign students"),
        });
    };

    const toggleStudent = (studentId: number) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Students to Module</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Search Students</label>
                        <Input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {loadingAssigned ? (
                            <p className="text-gray-500 text-center">Loading assigned students...</p>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <div key={student.id} className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => toggleStudent(student.id)}
                                        disabled={assignedStudents.includes(student.id)}
                                    />
                                    <span className={`ml-2 ${assignedStudents.includes(student.id) ? "text-gray-400" : ""}`}>
                                        {student.name} {assignedStudents.includes(student.id) ? "(Already Assigned)" : ""}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No students found</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAssign} disabled={selectedStudents.length === 0}>
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
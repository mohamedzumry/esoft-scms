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

interface Batch {
    id: number;
    code: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    courseId: number;
    students: User[];
}

export default function AssignStudentsToCourseDialog({ open, onClose, courseId, students }: Props) {
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [selectedBatchId, setSelectedBatchId] = useState<string>("");
    const [batches, setBatches] = useState<Batch[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingBatches, setLoadingBatches] = useState<boolean>(false);
    const [assignedStudents, setAssignedStudents] = useState<number[]>([]);
    const [loadingAssigned, setLoadingAssigned] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setLoadingBatches(true);
            fetch(`/dashboard/courses/${courseId}/batches`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                },
            })
                .then((response) => response.json())
                .then((data) => setBatches(data))
                .catch((error) => {
                    console.error("Failed to fetch batches:", error);
                    toast.error("Failed to load batches");
                })
                .finally(() => setLoadingBatches(false));
        }
    }, [open, courseId]);

    useEffect(() => {
        if (selectedBatchId) {
            setLoadingAssigned(true);
            fetch(`/dashboard/courses/${courseId}/students?batch_id=${selectedBatchId}`, {
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
    }, [selectedBatchId, courseId]);

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssign = () => {
        if (!selectedBatchId) {
            toast.error("Please select a batch");
            return;
        }

        router.post(`/dashboard/courses/${courseId}/students`, {
            student_ids: selectedStudents,
            batch_id: selectedBatchId,
        }, {
            onSuccess: () => {
                toast.success("Students assigned to course successfully");
                setSelectedStudents([]);
                setSelectedBatchId("");
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
                    <DialogTitle>Assign Students to Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Select Batch</label>
                        <select
                            value={selectedBatchId}
                            onChange={(e) => setSelectedBatchId(e.target.value)}
                            className="block w-full mt-1 border rounded p-2"
                            disabled={loadingBatches}
                        >
                            <option value="">Select a Batch</option>
                            {batches.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.code}
                                </option>
                            ))}
                        </select>
                        {loadingBatches && <p className="text-sm text-gray-500">Loading batches...</p>}
                    </div>
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
                    <Button
                        onClick={handleAssign}
                        disabled={selectedStudents.length === 0 || !selectedBatchId}
                    >
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
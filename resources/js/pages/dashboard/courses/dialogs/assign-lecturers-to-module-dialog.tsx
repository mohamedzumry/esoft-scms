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

interface Module {
    id: number;
    course_id: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    moduleId: number;
    lecturers: User[];
    module: Module;
}

export default function AssignLecturersToModuleDialog({ open, onClose, moduleId, lecturers, module }: Props) {
    const [selectedLecturers, setSelectedLecturers] = useState<number[]>([]);
    const [selectedBatchId, setSelectedBatchId] = useState<string>("");
    const [batches, setBatches] = useState<Batch[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingBatches, setLoadingBatches] = useState<boolean>(false);
    const [assignedLecturers, setAssignedLecturers] = useState<number[]>([]);
    const [loadingAssigned, setLoadingAssigned] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setLoadingBatches(true);
            fetch(`/dashboard/courses/${module.course_id}/batches`, {
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
    }, [open, module.course_id]);

    useEffect(() => {
        if (selectedBatchId) {
            setLoadingAssigned(true);
            fetch(`/dashboard/modules/${moduleId}/lecturers?batch_id=${selectedBatchId}`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                },
            })
                .then((response) => response.json())
                .then((data) => setAssignedLecturers(data))
                .catch((error) => {
                    console.error("Failed to fetch assigned lecturers:", error);
                    toast.error("Failed to load assigned lecturers");
                })
                .finally(() => setLoadingAssigned(false));
        }
    }, [selectedBatchId, moduleId]);

    const filteredLecturers = lecturers.filter((lecturer) =>
        lecturer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssign = () => {
        if (!selectedBatchId) {
            toast.error("Please select a batch");
            return;
        }

        router.post(`/dashboard/modules/${moduleId}/lecturers`, {
            lecturer_ids: selectedLecturers,
            batch_id: selectedBatchId,
        }, {
            onSuccess: () => {
                toast.success("Lecturers assigned to module successfully");
                setSelectedLecturers([]);
                setSelectedBatchId("");
                setSearchQuery("");
                setAssignedLecturers([]);
                onClose();
            },
            onError: () => toast.error("Failed to assign lecturers"),
        });
    };

    const toggleLecturer = (lecturerId: number) => {
        setSelectedLecturers((prev) =>
            prev.includes(lecturerId)
                ? prev.filter((id) => id !== lecturerId)
                : [...prev, lecturerId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Lecturers to Module</DialogTitle>
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
                        <label className="block text-sm font-medium">Search Lecturers</label>
                        <Input
                            type="text"
                            placeholder="Search lecturers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {loadingAssigned ? (
                            <p className="text-gray-500 text-center">Loading assigned lecturers...</p>
                        ) : filteredLecturers.length > 0 ? (
                            filteredLecturers.map((lecturer) => (
                                <div key={lecturer.id} className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedLecturers.includes(lecturer.id)}
                                        onChange={() => toggleLecturer(lecturer.id)}
                                        disabled={assignedLecturers.includes(lecturer.id)}
                                    />
                                    <span className={`ml-2 ${assignedLecturers.includes(lecturer.id) ? "text-gray-400" : ""}`}>
                                        {lecturer.name} {assignedLecturers.includes(lecturer.id) ? "(Already Assigned)" : ""}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No lecturers found</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleAssign}
                        disabled={selectedLecturers.length === 0 || !selectedBatchId}
                    >
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
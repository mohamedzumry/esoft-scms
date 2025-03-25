import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Member {
    id: number;
    name: string;
    role: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    chatId: number;
    chatName: string;
}

export default function ViewMembersDialog({ open, onClose, chatId, chatName }: Props) {
    const [members, setMembers] = useState<Member[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        if (open) {
            setLoading(true);
            fetch(`/dashboard/chats/${chatId}/members`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((errorData) => {
                            throw new Error(errorData.error || "Failed to fetch members");
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    // Extract the members array from the response object
                    const membersData = Array.isArray(data.members) ? data.members : [];
                    setMembers(membersData);
                    setFilteredMembers(membersData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching members:", error);
                    toast.error(error.message || "Failed to load members");
                    setMembers([]);
                    setFilteredMembers([]);
                    setLoading(false);
                });
        } else {
            setMembers([]);
            setFilteredMembers([]);
            setSearchQuery("");
            setLoading(false);
        }
    }, [open, chatId]);

    useEffect(() => {
        if (Array.isArray(members)) {
            setFilteredMembers(
                members.filter((member) =>
                    member.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredMembers([]);
        }
    }, [searchQuery, members]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Members of {chatName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="max-h-64 overflow-y-auto">
                        {loading ? (
                            <p className="text-gray-500 text-center">Loading members...</p>
                        ) : filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div key={member.id} className="p-2 border-b">
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.role}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No members found.</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
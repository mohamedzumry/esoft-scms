import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import ChatSidebar from "./components/chat-sidebar";
import ChatView from "./components/chat-view";
import CreateChat from "./create";
import ViewMembersDialog from "./components/view-members-dialog"; // Import the new dialog
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Chats", href: "/dashboard/chats" },
];

interface Chat {
    id: number;
    chat_name: string;
    creator: { id: number; name: string };
    course: { id: number; name: string };
    batch: { id: number; code: string };
    module?: { id: number; name: string } | null;
    can_delete: boolean;
}

interface Message {
    id: number;
    user: { id: number; name: string };
    message: string;
    created_at: string;
}

interface File {
    id: number;
    name: string;
    url: string;
    uploaded_by: { id: number; name: string };
    created_at: string;
}

interface Course {
    id: number;
    name: string;
}

interface ChatProps {
    auth: { user: { id: number; role: string } };
    chats: Chat[];
    courses: Course[];
}

interface ChatData {
    chat: Chat;
    messages: Message[];
}

export default function Index({ auth, chats, courses }: ChatProps) {
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [chatData, setChatData] = useState<ChatData | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
    const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState<boolean>(false);
    const [selectedChatForMembers, setSelectedChatForMembers] = useState<Chat | null>(null);
    const { flash } = usePage().props as any;

    const openDeleteDialog = (chat: Chat) => {
        setChatToDelete(chat);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!chatToDelete) return;

        setDeletingId(chatToDelete.id);
        router.delete(`/dashboard/chats/${chatToDelete.id}`, {
            onSuccess: () => {
                toast.success('Chat deleted successfully');
                setDeletingId(null);
                setIsDeleteDialogOpen(false);
                setChatToDelete(null);
                if (selectedChat === chatToDelete.id) {
                    setSelectedChat(null);
                    setChatData(null);
                }
            },
            onError: (errors) => {
                toast.error('Failed to delete chat');
                console.error(errors);
                setDeletingId(null);
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const openViewMembersDialog = (chat: Chat) => {
        setSelectedChatForMembers(chat);
        setIsViewMembersDialogOpen(true);
    };

    const refreshChatData = useCallback(() => {
        if (selectedChat) {
            fetch(`/dashboard/chats/${selectedChat}/data`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                },
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Failed to fetch chat data");
                    return response.json();
                })
                .then((data: ChatData) => {
                    setChatData({
                        chat: data.chat,
                        messages: data.messages,
                    });
                })
                .catch((error) => {
                    console.error("Error loading chat:", error);
                    setChatData(null);
                });
        }
    }, [selectedChat]);


    useEffect(() => {
        refreshChatData();
    }, [selectedChat, refreshChatData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Chats" />
            <div className="flex" style={{ height: "calc(100vh - 5rem)" }}>
                <ChatSidebar
                    chats={chats}
                    onSelectChat={setSelectedChat}
                    onCreateChat={() => setIsCreateModalOpen(true)}
                    onDeleteChat={openDeleteDialog}
                    onViewMembers={openViewMembersDialog}
                    selectedChatId={selectedChat}
                    deletingId={deletingId}
                    auth={auth}
                />
                {selectedChat && chatData ? (
                    <ChatView
                        chat={chatData.chat}
                        messages={chatData.messages}
                        auth={auth}
                        refreshChatData={refreshChatData}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Select a chat to view messages</p>
                    </div>
                )}
            </div>
            <CreateChat
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                auth={auth}
                courses={courses}
            />
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Chat</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete the chat "{chatToDelete?.chat_name}"? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deletingId !== null}>
                            {deletingId ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {selectedChatForMembers && (
                <ViewMembersDialog
                    open={isViewMembersDialogOpen}
                    onClose={() => setIsViewMembersDialogOpen(false)}
                    chatId={selectedChatForMembers.id}
                    chatName={selectedChatForMembers.chat_name}
                />
            )}
        </AppLayout>
    );
}
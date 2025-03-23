import { useState } from "react";
import ChatSidebar from "./components/chat-sidebar";
import ChatView from "./components/chat-view";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { ChartProps } from "react-chartjs-2";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chats',
        href: '/dashboard/chats',
    },
];

interface ChatProps {
    auth: {
        user: {
            id: number;
            role: string;
        };
    };
}

export default function Index({ auth }: ChatProps) {
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const chats = [
        { id: 1, name: "Chat 1" },
        { id: 2, name: "Chat 2" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />
            <div className="flex" style={{ height: "calc(100vh - 5rem)" }} >
                <ChatSidebar
                    chats={chats}
                    onSelectChat={setSelectedChat}
                    onCreateChat={() => alert("Create New Chat")}
                    selectedChatId={selectedChat}
                    auth={auth} />
                {selectedChat && <ChatView chatId={selectedChat} />}
            </div>
        </AppLayout>
    );
}
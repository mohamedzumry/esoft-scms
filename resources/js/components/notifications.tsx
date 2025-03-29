import { Button } from '@/components/ui/button';
import { Notification } from '@/types';
import { router } from '@inertiajs/react';
import clsx from 'clsx';
import { Bell, MessageSquareMore, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const typeToIcon = {
    message: <MessageSquareMore size={16} />,
    alert: <Bell size={16} />,
    system: <Settings size={16} />,
};

export default function Notifications({ notifications }: { notifications: Notification[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [localNotifications, setLocalNotifications] = useState(notifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const markAsRead = (notificationId: string) => {
        router.post(
            `/notifications/${notificationId}/read`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setLocalNotifications((prevNotifications) =>
                        prevNotifications.map((n) => (n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)),
                    );
                },
            },
        );
    };

    const markAllAsRead = () => {
        router.post(
            '/notifications/mark-all-as-read',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setLocalNotifications((prevNotifications) => prevNotifications.map((n) => ({ ...n, read_at: new Date().toISOString() })));
                },
            },
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative" aria-haspopup="true" aria-expanded={isOpen}>
                <Bell className="h-5 w-5" />
                {localNotifications.filter((n) => !n.read_at).length > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 animate-ping items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {localNotifications.filter((n) => !n.read_at).length}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div
                    className={clsx(
                        'absolute right-0 z-10 mt-2 w-80 rounded-lg bg-gray-100 p-4 shadow-lg dark:bg-gray-800',
                        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                    )}
                    role="listbox"
                    style={{ transition: 'opacity 0.3s, transform 0.3s' }}
                >
                    <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-white">Notifications</h3>
                    <div className="max-h-60 overflow-y-auto">
                        {localNotifications.length > 0 ? (
                            localNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={clsx(
                                        'border-b p-2 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700',
                                        notification.read_at ? 'opacity-50' : '',
                                    )}
                                >
                                    <div className="flex items-center">
                                        {typeToIcon[notification.type] || <Bell size={24} />}
                                        <a
                                            href={notification.data.url}
                                            className={clsx(
                                                'ml-2 text-blue-600 hover:underline dark:text-blue-400',
                                                !notification.read_at ? 'font-semibold' : '',
                                            )}
                                            onClick={() => {
                                                if (!notification.read_at) {
                                                    markAsRead(notification.id);
                                                }
                                            }}
                                        >
                                            {notification.data.message}
                                        </a>
                                    </div>
                                    <small className="mt-1 block text-gray-500 dark:text-gray-400">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </small>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No new notifications.</p>
                        )}
                    </div>
                    {localNotifications.filter((n) => !n.read_at).length > 1 && (
                        <div className="mt-2">
                            <button className="text-sm text-blue-600 hover:underline dark:text-blue-400" onClick={markAllAsRead}>
                                Mark all as read
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

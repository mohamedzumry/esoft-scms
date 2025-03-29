import { Inertia } from '@inertiajs/inertia';

declare module '@inertiajs/react' {
    interface Notification {
        id: string;
        data: {
            message: string;
            chat_id: number;
            chat_name: string;
            url: string;
        };
        read_at: string | null;
    }

    interface PageProps {
        [key: string]: any;
        auth: {
            user: {
                id: number;
                role: string;
            };
        };
        flash?: {
            success?: string;
            error?: string;
        };
        notifications?: Notification[];
        errors?: Record<string, string>;
    }

    export interface InertiaPage {
        props: PageProps;
        component: string;
        url: string;
        version: string;
    }

    export interface Inertia {
        delete: (
            url: string,
            options?: {
                preserveState?: boolean;
                preserveScroll?: boolean;
                onSuccess?: (page: InertiaPage) => void;
                onError?: (errors: Record<string, string>) => void;
                onFinish?: () => void;
            }
        ) => void;
    }
}
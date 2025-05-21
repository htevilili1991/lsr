// resources/js/pages/Error.tsx
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface Props {
    message?: string;
    auth?: {
        user: { id: number; name: string; email: string; avatar?: string } | null;
    };
}

export default function ErrorPage({ message = 'An unexpected error occurred.' }: Props) {
    const { auth } = usePage().props;

    return (
        <AppLayout title="Error">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-700">{message}</p>
                        <a
                            href="/registry"
                            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Back to Registry
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

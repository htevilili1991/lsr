import React from 'react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface Props extends PageProps {
    message: string;
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            avatar?: string;
        } | null;
    };
}

const Error: React.FC<Props> = ({ message, auth }) => {
    return (
        <AppLayout title="Error" auth={auth}>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                <div className="bg-red-100 p-4 rounded">
                    <h2 className="text-xl font-bold">Error</h2>
                    <p>{message}</p>
                </div>
            </div>
        </AppLayout>
    );
};

export default Error;

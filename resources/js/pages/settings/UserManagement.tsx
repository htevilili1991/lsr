import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, type SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface Props {
    users: User[];
    errors?: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        label: 'User management',
        href: '/settings/users',
    },
];

export default function Appearance() {

    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="User Management" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="User Management" description="Manage users and their roles" />

                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

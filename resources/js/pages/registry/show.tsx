import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import React from 'react';

// Define TypeScript interface for Registry
interface Registry {
    id: number;
    surname: string;
    given_name: string;
    nationality: string;
    country_of_residence: string;
    document_type: string;
    document_no: string;
    dob: string;
    age: number;
    sex: string;
    travel_date: string;
    direction: string;
    accommodation_address: string;
    note: string | null;
    travel_reason: string;
    border_post: string;
    destination_coming_from: string;
}

interface Props {
    auth: {
        user: User | null;
    };
    registry: Registry;
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Registry',
        href: '/registry',
    },
    {
        title: 'View',
        href: null,
    },
];

export default function Show({ auth, registry }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title={`Registry - ${registry.surname} ${registry.given_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    Registry Details - {registry.surname} {registry.given_name}
                </h1>
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Surname</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.surname}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Given Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.given_name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.nationality}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Country of Residence</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.country_of_residence}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Document Type</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.document_type}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Document Number</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.document_no}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.dob}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Age</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.age}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Sex</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.sex}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Travel Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.travel_date}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Direction</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.direction}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Accommodation Address</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.accommodation_address}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Note</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.note ?? 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Travel Reason</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.travel_reason}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Border Post</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.border_post}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Destination/Coming From</dt>
                            <dd className="mt-1 text-sm text-gray-900">{registry.destination_coming_from}</dd>
                        </div>
                    </dl>
                    <div className="mt-6">
                        <Link
                            href="/registry"
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Back to Registry
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

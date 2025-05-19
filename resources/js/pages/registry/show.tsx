import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces
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
    errors: Partial<Record<keyof Registry, string>>;
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Registry', href: '/registry' },
    { title: 'View', href: '#' },
];

export default function ShowRegistry({ auth, registry, errors }: Props) {
    const initialData = {
        surname: registry.surname,
        given_name: registry.given_name,
        nationality: registry.nationality,
        country_of_residence: registry.country_of_residence,
        document_type: registry.document_type,
        document_no: registry.document_no,
        dob: registry.dob,
        age: registry.age,
        sex: registry.sex,
        travel_date: registry.travel_date,
        direction: registry.direction,
        accommodation_address: registry.accommodation_address,
        note: registry.note || '',
        travel_reason: registry.travel_reason,
        border_post: registry.border_post,
        destination_coming_from: registry.destination_coming_from,
    };

    const { data, setData, put, processing, errors: formErrors } = useForm(initialData);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const hasChanges = Object.keys(initialData).some(
            key => initialData[key as keyof typeof initialData] !== data[key as keyof typeof data]
        );
        setIsDirty(hasChanges);
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting data:', data);
        put(`/registry/${registry.id}`, {
            onSuccess: () => router.visit('/registry'),
            onError: (errors) => {
                console.error('Update errors:', errors);
                window.alert('Failed to update record. Check console for details.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="View Registry" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h3 className="text-lg font-medium mb-4">Registry Record Details</h3>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Surname</label>
                        <input
                            type="text"
                            value={data.surname}
                            onChange={e => setData('surname', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.surname || formErrors.surname) && (
                            <p className="mt-1 text-sm text-red-600">{errors.surname || formErrors.surname}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Given Name</label>
                        <input
                            type="text"
                            value={data.given_name}
                            onChange={e => setData('given_name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.given_name || formErrors.given_name) && (
                            <p className="mt-1 text-sm text-red-600">{errors.given_name || formErrors.given_name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nationality</label>
                        <input
                            type="text"
                            value={data.nationality}
                            onChange={e => setData('nationality', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.nationality || formErrors.nationality) && (
                            <p className="mt-1 text-sm text-red-600">{errors.nationality || formErrors.nationality}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Country of Residence</label>
                        <input
                            type="text"
                            value={data.country_of_residence}
                            onChange={e => setData('country_of_residence', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.country_of_residence || formErrors.country_of_residence) && (
                            <p className="mt-1 text-sm text-red-600">{errors.country_of_residence || formErrors.country_of_residence}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Document Type</label>
                        <input
                            type="text"
                            value={data.document_type}
                            onChange={e => setData('document_type', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring0 focus:ring-blue-500"
                        />
                        {(errors.document_type || formErrors.document_type) && (
                            <p className="mt-1 text-sm text-red-600">{errors.document_type || formErrors.document_type}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Document No.</label>
                        <input
                            type="text"
                            value={data.document_no}
                            onChange={e => setData('document_no', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.document_no || formErrors.document_no) && (
                            <p className="mt-1 text-sm text-red-600">{errors.document_no || formErrors.document_no}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            value={data.dob}
                            onChange={e => setData('dob', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.dob || formErrors.dob) && (
                            <p className="mt-1 text-sm text-red-600">{errors.dob || formErrors.dob}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            type="number"
                            value={data.age}
                            onChange={e => setData('age', Number(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.age || formErrors.age) && (
                            <p className="mt-1 text-sm text-red-600">{errors.age || formErrors.age}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sex</label>
                        <input
                            type="text"
                            value={data.sex}
                            onChange={e => setData('sex', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.sex || formErrors.sex) && (
                            <p className="mt-1 text-sm text-red-600">{errors.sex || formErrors.sex}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Travel Date</label>
                        <input
                            type="date"
                            value={data.travel_date}
                            onChange={e => setData('travel_date', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.travel_date || formErrors.travel_date) && (
                            <p className="mt-1 text-sm text-red-600">{errors.travel_date || formErrors.travel_date}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Direction</label>
                        <input
                            type="text"
                            value={data.direction}
                            onChange={e => setData('direction', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.direction || formErrors.direction) && (
                            <p className="mt-1 text-sm text-red-600">{errors.direction || formErrors.direction}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Accommodation Address</label>
                        <input
                            type="text"
                            value={data.accommodation_address}
                            onChange={e => setData('accommodation_address', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.accommodation_address || formErrors.accommodation_address) && (
                            <p className="mt-1 text-sm text-red-600">{errors.accommodation_address || formErrors.accommodation_address}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Note</label>
                        <textarea
                            value={data.note || ''}
                            onChange={e => setData('note', e.target.value || null)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.note || formErrors.note) && (
                            <p className="mt-1 text-sm text-red-600">{errors.note || formErrors.note}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Travel Reason</label>
                        <input
                            type="text"
                            value={data.travel_reason}
                            onChange={e => setData('travel_reason', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.travel_reason || formErrors.travel_reason) && (
                            <p className="mt-1 text-sm text-red-600">{errors.travel_reason || formErrors.travel_reason}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Border Post</label>
                        <input
                            type="text"
                            value={data.border_post}
                            onChange={e => setData('border_post', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.border_post || formErrors.border_post) && (
                            <p className="mt-1 text-sm text-red-600">{errors.border_post || formErrors.border_post}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destination/Coming From</label>
                        <input
                            type="text"
                            value={data.destination_coming_from}
                            onChange={e => setData('destination_coming_from', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {(errors.destination_coming_from || formErrors.destination_coming_from) && (
                            <p className="mt-1 text-sm text-red-600">{errors.destination_coming_from || formErrors.destination_coming_from}</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Link
                            href="/registry"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Back
                        </Link>
                        {isDirty && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                Update
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

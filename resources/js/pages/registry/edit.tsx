import { Head, Link, useForm } from '@inertiajs/react';
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
        title: 'Edit',
        href: null,
    },
];

export default function Edit({ auth, registry }: Props) {
    const { data, setData, put, errors } = useForm({
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
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/registry/${registry.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title={`Edit Registry - ${registry.surname} ${registry.given_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    Edit Registry - {registry.surname} {registry.given_name}
                </h1>
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border bg-white p-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                                Surname
                            </label>
                            <input
                                type="text"
                                id="surname"
                                value={data.surname}
                                onChange={e => setData('surname', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.surname && <p className="mt-1 text-sm text-red-600">{errors.surname}</p>}
                        </div>
                        <div>
                            <label htmlFor="given_name" className="block text-sm font-medium text-gray-700">
                                Given Name
                            </label>
                            <input
                                type="text"
                                id="given_name"
                                value={data.given_name}
                                onChange={e => setData('given_name', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.given_name && <p className="mt-1 text-sm text-red-600">{errors.given_name}</p>}
                        </div>
                        <div>
                            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                                Nationality
                            </label>
                            <input
                                type="text"
                                id="nationality"
                                value={data.nationality}
                                onChange={e => setData('nationality', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
                        </div>
                        <div>
                            <label htmlFor="country_of_residence" className="block text-sm font-medium text-gray-700">
                                Country of Residence
                            </label>
                            <input
                                type="text"
                                id="country_of_residence"
                                value={data.country_of_residence}
                                onChange={e => setData('country_of_residence', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.country_of_residence && (
                                <p className="mt-1 text-sm text-red-600">{errors.country_of_residence}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="document_type" className="block text-sm font-medium text-gray-700">
                                Document Type
                            </label>
                            <input
                                type="text"
                                id="document_type"
                                value={data.document_type}
                                onChange={e => setData('document_type', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.document_type && <p className="mt-1 text-sm text-red-600">{errors.document_type}</p>}
                        </div>
                        <div>
                            <label htmlFor="document_no" className="block text-sm font-medium text-gray-700">
                                Document Number
                            </label>
                            <input
                                type="text"
                                id="document_no"
                                value={data.document_no}
                                onChange={e => setData('document_no', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.document_no && <p className="mt-1 text-sm text-red-600">{errors.document_no}</p>}
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                id="dob"
                                value={data.dob}
                                onChange={e => setData('dob', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                value={data.age}
                                onChange={e => setData('age', parseInt(e.target.value))}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                        </div>
                        <div>
                            <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                                Sex
                            </label>
                            <input
                                type="text"
                                id="sex"
                                value={data.sex}
                                onChange={e => setData('sex', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.sex && <p className="mt-1 text-sm text-red-600">{errors.sex}</p>}
                        </div>
                        <div>
                            <label htmlFor="travel_date" className="block text-sm font-medium text-gray-700">
                                Travel Date
                            </label>
                            <input
                                type="date"
                                id="travel_date"
                                value={data.travel_date}
                                onChange={e => setData('travel_date', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.travel_date && <p className="mt-1 text-sm text-red-600">{errors.travel_date}</p>}
                        </div>
                        <div>
                            <label htmlFor="direction" className="block text-sm font-medium text-gray-700">
                                Direction
                            </label>
                            <input
                                type="text"
                                id="direction"
                                value={data.direction}
                                onChange={e => setData('direction', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.direction && <p className="mt-1 text-sm text-red-600">{errors.direction}</p>}
                        </div>
                        <div>
                            <label htmlFor="accommodation_address" className="block text-sm font-medium text-gray-700">
                                Accommodation Address
                            </label>
                            <input
                                type="text"
                                id="accommodation_address"
                                value={data.accommodation_address}
                                onChange={e => setData('accommodation_address', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.accommodation_address && (
                                <p className="mt-1 text-sm text-red-600">{errors.accommodation_address}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                Note
                            </label>
                            <textarea
                                id="note"
                                value={data.note}
                                onChange={e => setData('note', e.target.value)}
                                className="mt-1 block w-full h-24 px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={4}
                            />
                            {errors.note && <p className="mt-1 text-sm text-red-600">{errors.note}</p>}
                        </div>
                        <div>
                            <label htmlFor="travel_reason" className="block text-sm font-medium text-gray-700">
                                Travel Reason
                            </label>
                            <input
                                type="text"
                                id="travel_reason"
                                value={data.travel_reason}
                                onChange={e => setData('travel_reason', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.travel_reason && <p className="mt-1 text-sm text-red-600">{errors.travel_reason}</p>}
                        </div>
                        <div>
                            <label htmlFor="border_post" className="block text-sm font-medium text-gray-700">
                                Border Post
                            </label>
                            <input
                                type="text"
                                id="border_post"
                                value={data.border_post}
                                onChange={e => setData('border_post', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.border_post && <p className="mt-1 text-sm text-red-600">{errors.border_post}</p>}
                        </div>
                        <div>
                            <label htmlFor="destination_coming_from" className="block text-sm font-medium text-gray-700">
                                Destination/Coming From
                            </label>
                            <input
                                type="text"
                                id="destination_coming_from"
                                value={data.destination_coming_from}
                                onChange={e => setData('destination_coming_from', e.target.value)}
                                className="mt-1 block w-full h-10 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            {errors.destination_coming_from && (
                                <p className="mt-1 text-sm text-red-600">{errors.destination_coming_from}</p>
                            )}
                        </div>
                        <div className="sm:col-span-2">
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Save
                                </button>
                                <Link
                                    href="/registry"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

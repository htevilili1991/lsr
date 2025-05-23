import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface Props extends PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            avatar?: string;
        } | null;
    };
    errors: {
        csv_file?: string;
    };
    success?: string;
    test?: string;
}

const Upload: React.FC = () => {
    const { errors, success, auth, test } = usePage<Props>().props;
    const { post, setData, processing } = useForm({
        csv_file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('csv_file', file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('registry.storeCsv'), {
            onSuccess: () => {
                setData('csv_file', null);
            },
        });
    };

    const breadcrumbs = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/registry/upload', label: 'Upload Registry CSV' },
    ];

    return (
        <AppLayout title="Upload Registry CSV" auth={auth}>
            <Head title="Upload Registry CSV" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-bold mb-4">Upload Registry CSV</h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Download the{' '}
                            <a
                                href="/template/registry-template.csv"
                                download
                                className="text-blue-600 hover:underline font-medium"
                            >
                                CSV template
                            </a>{' '}
                            to ensure your file is formatted correctly. The template includes all required fields for the registry. When importing, records with duplicate document numbers will be skipped to prevent data redundancy.
                        </p>
                        {test && (
                            <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
                                {test}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                                {success}
                            </div>
                        )}
                        {errors.csv_file && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                                {errors.csv_file}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-4">
                                <label htmlFor="csv_file" className="block text-sm font-medium text-gray-700">
                                    Select CSV File
                                </label>
                                <input
                                    type="file"
                                    id="csv_file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    processing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {processing ? 'Uploading...' : 'Upload CSV'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Upload;

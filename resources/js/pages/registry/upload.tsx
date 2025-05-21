// resources/js/Pages/Registry/Upload.tsx
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface Props {
    errors: Record<string, string>;
    auth?: {
        user: { id: number; name: string; email: string; avatar?: string } | null;
    };
}

export default function Upload({ errors, auth }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const { csrf_token } = usePage().props;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a CSV file.');
            return;
        }

        const formData = new FormData();
        formData.append('csv_file', file);

        Inertia.post('/registry/upload', formData, {
            headers: {
                'X-CSRF-TOKEN': csrf_token as string,
            },
            onSuccess: () => {
                alert('CSV uploaded successfully!');
                setFile(null);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout title="Upload CSV">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-bold mb-4">Upload Labour Registry Data</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="csv_file" className="block text-sm font-medium text-gray-700">
                                    Select CSV File
                                </label>
                                <input
                                    type="file"
                                    id="csv_file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full"
                                />
                                {errors.csv_file && (
                                    <p className="text-red-500 text-sm mt-1">{errors.csv_file}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Upload
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

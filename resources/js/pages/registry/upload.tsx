import { usePage } from '@inertiajs/react';
import { useState } from 'react';

interface FlashMessages {
    success?: string;
    error?: string;
}

interface PageProps {
    flash: FlashMessages;
}

const Upload: React.FC = () => {
    const { flash } = usePage<PageProps>().props;
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Append Registry CSV</h1>

            {flash.success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {flash.error}
                </div>
            )}

            <form action="/registry/csv-upload" method="POST" encType="multipart/form-data">
                <input type="hidden" name="_token" value={window.csrfToken} />
                <div className="mb-4">
                    <label htmlFor="csv_file" className="block text-sm font-medium text-gray-700">
                        Select CSV File
                    </label>
                    <input
                        type="file"
                        id="csv_file"
                        name="csv_file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!file}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    Upload
                </button>
            </form>

            <div className="mt-6">
                <h2 className="text-lg font-semibold">CSV Format</h2>
                <p className="text-sm text-gray-600">
                    Your CSV file should have the following columns: <code>surname</code>, <code>given_name</code>, <code>nationality</code>, <code>country_of_residence</code>, <code>document_type</code>, <code>document_no</code>, <code>dob</code>, <code>age</code>, <code>sex</code>, <code>travel_date</code>, <code>direction</code>, <code>accommodation_address</code>, <code>note</code>, <code>travel_reason</code>, <code>border_post</code>, <code>destination_coming_from</code>.
                    New records will be appended to the existing table. Duplicate document numbers will be skipped.
                    Example:
                </p>
                <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">
                    {`surname,given_name,nationality,country_of_residence,document_type,document_no,dob,age,sex,travel_date,direction,accommodation_address,note,travel_reason,border_post,destination_coming_from
Smith,John,USA,USA,Passport,AB123456,1990-01-01,35,Male,2025-06-01,Inbound,123 Main St,,Business,Border A,Canada
Doe,Jane,UK,UK,Passport,CD789012,1985-05-15,40,Female,2025-07-01,Outbound,456 Elm St,Meeting,Tourism,Border B,France`}
                </pre>
            </div>
        </div>
    );
}

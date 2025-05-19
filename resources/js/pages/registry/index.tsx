import { Head, Link } from '@inertiajs/react';
import { useReactTable, getCoreRowModel, getSortedRowModel, type ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import React from 'react';

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
    registry: Registry[];
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Registry',
        href: '/registry',
    },
];

export default function Registry({ auth, registry }: Props) {
    // Define columns
    const columns: ColumnDef<Registry>[] = React.useMemo(
        () => [
            { header: 'Surname', accessorKey: 'surname', enableSorting: true },
            { header: 'Given Name', accessorKey: 'given_name', enableSorting: true },
            { header: 'Document Type', accessorKey: 'document_type', enableSorting: true },
            { header: 'Document No.', accessorKey: 'document_no', enableSorting: true },
            { header: 'DOB', accessorKey: 'dob', enableSorting: true },
            { header: 'Sex', accessorKey: 'sex', enableSorting: true },
            { header: 'Travel Date', accessorKey: 'travel_date', enableSorting: true },
            { header: 'Direction', accessorKey: 'direction', enableSorting: true },
            { header: 'Accommodation Address', accessorKey: 'accommodation_address', enableSorting: true },
            { header: 'Travel Reason', accessorKey: 'travel_reason', enableSorting: true },
            { header: 'Destination/Coming From', accessorKey: 'destination_coming_from', enableSorting: true },
        ],
        []
    );

    // Initialize react-table
    const table = useReactTable<Registry>({
        data: registry || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Registry" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h3 className="text-lg font-medium mb-4">Registry Data</h3>
                {registry?.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 11h18m-9 4h9m-9 4h6" />
                        </svg>
                        <p className="mt-2 text-gray-500">No registry data available.</p>
                    </div>
                ) : (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-x-auto rounded-xl border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {header.isPlaceholder ? null : header.column.columnDef.header}
                                            <span>
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? ''}
                                                </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            <Link
                                                href={`/registry/${row.original.id}`}
                                                className="block w-full h-full"
                                            >
                                                {cell.getValue() ? String(cell.getValue()) : 'N/A'}
                                            </Link>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

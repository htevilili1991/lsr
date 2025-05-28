import { Head, Link, usePage, router } from '@inertiajs/react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import React, { useEffect, useState, useCallback } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DownloadIcon, ChevronDownIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    auth: {
        user: User | null;
    };
    registry: {
        data: Registry[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
    },
    {
        label: 'Registry',
        href: '/registry',
    },
];

export default function Registry({ auth, registry }: Props) {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const initialSearch = searchParams.get('search') || '';
    const [globalFilter, setGlobalFilter] = useState(initialSearch);
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(!!flashMessage);
    const [exportError, setExportError] = useState<string | null>(null);

    useEffect(() => {
        if (flashMessage || exportError) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                setExportError(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage, exportError]);

    const columns: ColumnDef<Registry>[] = React.useMemo(
        () => [
            { header: 'Surname', accessorKey: 'surname', enableSorting: true },
            { header: 'Given Name', accessorKey: 'given_name', enableSorting: true },
            { header: 'Nationality', accessorKey: 'nationality', enableSorting: true },
            { header: 'Country of Residence', accessorKey: 'country_of_residence', enableSorting: true },
            { header: 'Document Type', accessorKey: 'document_type', enableSorting: true },
            { header: 'Document Number', accessorKey: 'document_no', enableSorting: true },
            { header: 'DoB', accessorKey: 'dob', enableSorting: true },
            { header: 'Sex', accessorKey: 'sex', enableSorting: true },
            { header: 'Age', accessorKey: 'age', enableSorting: true },
            { header: 'Travel Date', accessorKey: 'travel_date', enableSorting: true },
            { header: 'Direction', accessorKey: 'direction', enableSorting: true },
            { header: 'Accommodation Address', accessorKey: 'accommodation_address', enableSorting: true },
            { header: 'Note', accessorKey: 'note', enableSorting: true },
            { header: 'Travel Reason', accessorKey: 'travel_reason', enableSorting: true },
            { header: 'Border Post', accessorKey: 'border_post', enableSorting: true },
            { header: 'Destination/Coming From', accessorKey: 'destination_coming_from', enableSorting: true },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Link
                            href={`/registry/${row.original.id}`}
                            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            View
                        </Link>
                        <Link
                            href={`/registry/${row.original.id}/edit`}
                            className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Edit
                        </Link>
                        <Link
                            href={`/registry/${row.original.id}`}
                            method="delete"
                            as="button"
                            className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this record?')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Delete
                        </Link>
                    </div>
                ),
                enableSorting: false,
            },
        ],
        []
    );

    const table = useReactTable<Registry>({
        data: registry.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: registry.meta.last_page,
        initialState: {
            pagination: {
                pageIndex: registry.meta.current_page - 1,
                pageSize: registry.meta.per_page,
            },
            columnVisibility: {
                nationality: false,
                country_of_residence: false,
                document_type: false,
                document_no: false,
                dob: false,
                age: false,
                direction: false,
                accommodation_address: false,
                note: false,
                border_post: false,
            },
        },
        state: {
            globalFilter,
            sorting: [],
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: (updater) => {
            const newSorting = typeof updater === 'function' ? updater(table.getState().sorting) : updater;
            const sortParams = newSorting.length > 0 ? `${newSorting[0].id}:${newSorting[0].desc ? 'desc' : 'asc'}` : '';
            router.visit(`/registry?page=${table.getState().pagination.pageIndex + 1}&per_page=${table.getState().pagination.pageSize}&sort=${sortParams}&search=${globalFilter}`, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
            router.visit(`/registry?page=${newPagination.pageIndex + 1}&per_page=${newPagination.pageSize}&sort=${table.getState().sorting[0]?.id || ''}:${table.getState().sorting[0]?.desc ? 'desc' : 'asc'}&search=${globalFilter}`, {
                preserveState: true,
                preserveScroll: true,
            });
        },
    });

    const handleSearchSubmit = useCallback(() => {
        router.visit(`/registry?page=1&per_page=${table.getState().pagination.pageSize}&sort=${table.getState().sorting[0]?.id || ''}:${table.getState().sorting[0]?.desc ? 'desc' : 'asc'}&search=${globalFilter}`, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [globalFilter, table]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (globalFilter !== initialSearch) {
                handleSearchSubmit();
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [globalFilter, initialSearch, handleSearchSubmit]);

    const exportToCSV = async () => {
        try {
            const response = await fetch(`/registry/export?search=${encodeURIComponent(globalFilter)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch export data');
            }

            const { registry: { data } }: { registry: { data: Registry[] } } = await response.json();

            const headers = [
                'surname',
                'given_name',
                'nationality',
                'country_of_residence',
                'document_type',
                'document_no',
                'dob',
                'age',
                'sex',
                'travel_date',
                'direction',
                'accommodation_address',
                'note',
                'travel_reason',
                'border_post',
                'destination_coming_from',
            ];

            const csvRows = [
                headers.join(','), // Header row
                ...data.map((row) =>
                    headers
                        .map((key) => {
                            const value = row[key as keyof Registry] ?? 'N/A';
                            return `"${String(value).replace(/"/g, '""')}"`; // Escape quotes for CSV
                        })
                        .join(',')
                ),
            ];

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `registry_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            setExportError('Failed to export data. Please try again.');
            setShowAlert(true);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Registry" />
            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && (flashMessage || exportError) && (
                    <Alert
                        variant={flash?.success ? 'default' : 'destructive'}
                        className={`fixed top-4 right-4 z-40 max-w-md animate-in fade-in slide-in-from-top-2 duration-300 ${
                            flash?.success ? 'bg-green-600' : 'bg-red-600'
                        } text-white shadow-lg rounded-lg ${!showAlert ? 'animate-out fade-out slide-out-to-top-2' : ''}`}
                    >
                        <AlertDescription className="text-white pr-8">
                            {flash?.success ? 'Success! ' : 'Error! '}
                            {flashMessage || exportError}
                        </AlertDescription>
                        <button
                            onClick={() => {
                                setShowAlert(false);
                                setExportError(null);
                            }}
                            className="absolute top-2 right-2 text-white hover:text-gray-200 focus:outline-none"
                            aria-label="Close alert"
                        >
                            ✕
                        </button>
                    </Alert>
                )}
                <div className="mb-4 flex items-center justify-between gap-2">
                    <Input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search registry..."
                        className="w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                    />
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table.getAllLeafColumns().map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        disabled={column.id === 'actions'} // Prevent hiding actions column
                                    >
                                        {column.columnDef.header as string}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={exportToCSV}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Export to CSV
                        </Button>
                    </div>
                </div>
                {registry.data?.length === 0 ? (
                    <div className="text-center py-8">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7h18M3 11h18m-9 4h9m-9 4h6"
                            />
                        </svg>
                        <p className="mt-2 text-gray-500">No registry data available.</p>
                    </div>
                ) : (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-x-auto rounded-xl border z-0">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
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
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {cell.column.id === 'actions'
                                                ? flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )
                                                : cell.getValue()
                                                    ? String(cell.getValue())
                                                    : 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">
                                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                                    {table.getPageCount()}
                                </span>
                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        table.setPageSize(Number(e.target.value));
                                    }}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 text-sm"
                                >
                                    {[10, 25, 50].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        table.getCanPreviousPage()
                                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        table.getCanNextPage()
                                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

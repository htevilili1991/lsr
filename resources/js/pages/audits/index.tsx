import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type RegistryAuditValues } from '@/types';
import { PaginatedResponse } from '@/types';
import Echo from 'laravel-echo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

interface Audit {
    id: number;
    user_id: number | null;
    user: User | null;
    event: string;
    auditable_type: string;
    auditable_id: number;
    old_values: RegistryAuditValues | null;
    new_values: RegistryAuditValues | null;
    created_at: string;
}

interface Props {
    auth: {
        user: User | null;
    };
    audits: PaginatedResponse<Audit>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Audit Logs', href: '/audits' },
];

const AuditIndex: React.FC<Props> = ({ auth, audits: initialAudits }) => {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [audits, setAudits] = useState<PaginatedResponse<Audit>>(initialAudits);
    const [showAlert, setShowAlert] = useState(!!flashMessage);
    const [alertMessage, setAlertMessage] = useState<string | null>(flashMessage || null);

    useEffect(() => {
        if (flashMessage) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    useEffect(() => {
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT,
            wssPort: import.meta.env.VITE_REVERB_PORT,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });

        window.Echo.channel('audits').listen('AuditLogged', (e: { audit: Audit }) => {
            if (e.audit.auditable_type === 'App\\Models\\Registry') {
                setAudits((prev) => ({
                    ...prev,
                    data: [e.audit, ...prev.data.slice(0, prev.meta.per_page - 1)],
                }));
                setAlertMessage('New audit log added.');
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 4000);
            }
        });

        return () => window.Echo.leave('audits');
    }, []);

    const columns: ColumnDef<Audit>[] = React.useMemo(
        () => [
            {
                header: 'User',
                accessorFn: (row) => row.user?.name ?? 'N/A',
                enableSorting: false,
            },
            { header: 'Event', accessorKey: 'event', enableSorting: true },
            { header: 'Registry ID', accessorKey: 'auditable_id', enableSorting: true },
            {
                header: 'Changes',
                accessorFn: (row) =>
                    JSON.stringify(row.event !== 'deleted' ? row.new_values : row.old_values, null, 2).replace(
                        /</g,
                        '<'
                    ),
                cell: ({ getValue }) => <pre className="text-sm">{getValue() as string}</pre>,
                enableSorting: false,
            },
            {
                header: 'Date',
                accessorFn: (row) => new Date(row.created_at).toLocaleString(),
                enableSorting: true,
                accessorKey: 'created_at',
            },
        ],
        []
    );

    const table = useReactTable<Audit>({
        data: audits.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        pageCount: audits.meta.last_page,
        initialState: {
            pagination: {
                pageIndex: audits.meta.current_page - 1,
                pageSize: audits.meta.per_page,
            },
        },
        state: {
            sorting: [],
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Audit Logs" />
            <div className="relative flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && alertMessage && (
                    <Alert
                        variant={flash?.success ? 'default' : 'destructive'}
                        className={`fixed top-4 right-4 z-40 max-w-md animate-in fade-in slide-in-from-top-2 duration-300 ${
                            flash?.success ? 'bg-green-600' : 'bg-red-600'
                        } text-white shadow-lg rounded-lg`}
                    >
                        <AlertDescription className="text-white pr-8">
                            {flash?.success ? 'Success! ' : 'Error! '}
                            {alertMessage}
                        </AlertDescription>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="absolute top-2 right-2 text-white hover:text-gray-200 focus:outline-none"
                            aria-label="Close alert"
                        >
                            ✕
                        </button>
                    </Alert>
                )}
                {audits.data.length === 0 ? (
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
                        <p className="mt-2 text-gray-500">No audit logs available.</p>
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
                                                : flexRender(header.column.columnDef.header, header.getContext())}
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
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => table.setPageSize(Number(e.target.value))}
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
};

export default AuditIndex;

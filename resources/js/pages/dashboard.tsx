import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface Registry {
    id: number;
    surname: string;
    given_name: string;
    nationality: string;
    travel_date: string;
    created_at: string;
}

interface Metrics {
    total_records: number;
    records_this_month: number;
    unique_nationalities: number;
}

interface Props {
    auth: {
        user: User | null;
    };
    metrics: Metrics;
    monthly_records: Record<string, number>;
    recent_records: Registry[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard',
        href: '/dashboard'
    },
];

export default function Dashboard({ auth, metrics, monthly_records, recent_records }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Metrics Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.total_records.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Records This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.records_this_month.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Unique Nationalities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.unique_nationalities.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Records Chart */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Records Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">

                    </CardContent>
                </Card>

                {/* Recent Records Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recent_records.length === 0 ? (
                            <p className="text-gray-500">No recent records available.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Surname</TableHead>
                                        <TableHead>Given Name</TableHead>
                                        <TableHead>Nationality</TableHead>
                                        <TableHead>Travel Date</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recent_records.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{record.surname || 'N/A'}</TableCell>
                                            <TableCell>{record.given_name || 'N/A'}</TableCell>
                                            <TableCell>{record.nationality || 'N/A'}</TableCell>
                                            <TableCell>
                                                {record.travel_date
                                                    ? format(new Date(record.travel_date), 'MMM dd, yyyy')
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(record.created_at), 'MMM dd, yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/registry/${record.id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

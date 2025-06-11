import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface Registry {
    id: number;
    surname: string;
    given_name: string;
    nationality: string;
    travel_date: string | null;
    created_at: string;
}

interface Metrics {
    total_records: number;
    records_this_month: number;
    unique_nationalities: number;
}

interface ChartData {
    name: string;
    y: number;
}

interface Props {
    auth: {
        user: User | null;
    };
    metrics: Metrics;
    monthly_records_travel: Record<string, number>;
    travel_reason_records: ChartData[];
    sex_records: ChartData[];
    recent_records: Registry[];
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard({ auth, metrics, monthly_records_travel, travel_reason_records, sex_records, recent_records, error }: Props) {
    const [activeTab, setActiveTab] = useState('travel-date');

    // Records Over Time (by travel_date)
    const hasTravelData = Object.keys(monthly_records_travel).length > 0;
    const travelChartOptions = {
        chart: {
            type: 'line',
            height: 300,
            backgroundColor: 'transparent',
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: hasTravelData
                ? Object.keys(monthly_records_travel).map((month) => {
                      const [year, m] = month.split('-');
                      return new Date(parseInt(year), parseInt(m) - 1).toLocaleString('default', {
                          month: 'short',
                          year: 'numeric',
                      });
                  })
                : [],
            title: {
                text: 'Month',
                style: { color: '#6b7280', fontSize: '12px' },
            },
            labels: { style: { color: '#6b7280', fontSize: '11px' } },
            gridLineWidth: 0,
        },
        yAxis: {
            title: {
                text: 'Number of Records',
                style: { color: '#6b7280', fontSize: '12px' },
            },
            min: 0,
            gridLineColor: 'rgba(0, 0, 0, 0.1)',
            labels: { style: { color: '#6b7280', fontSize: '11px' } },
        },
        series: [
            {
                name: 'Records',
                data: hasTravelData ? Object.values(monthly_records_travel) : [],
                color: '#3b82f6',
                lineWidth: 2,
                marker: {
                    enabled: true,
                    radius: 4,
                    fillColor: '#3b82f6',
                    lineColor: '#ffffff',
                    lineWidth: 1,
                },
                states: { hover: { lineWidth: 3 } },
            },
        ],
        plotOptions: { line: { linecap: 'round' } },
        legend: { enabled: false },
        credits: { enabled: false },
        tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            borderRadius: 8,
            shadow: true,
            padding: 8,
            style: { color: '#1f2937', fontSize: '12px' },
            formatter: function (this: Highcharts.TooltipFormatterContextObject) {
                return `<b>${this.x}</b><br/>Records: ${this.y}`;
            },
        },
        responsive: {
            rules: [
                {
                    condition: { maxWidth: 500 },
                    chartOptions: {
                        chart: { height: 200 },
                        xAxis: { labels: { style: { fontSize: '10px' } } },
                    },
                },
            ],
        },
    };

    // Records by Travel Reason
    const hasReasonData = travel_reason_records.length > 0;
    const reasonChartOptions = {
        chart: {
            type: 'pie',
            height: 300,
            backgroundColor: 'transparent',
        },
        title: { text: null },
        series: [
            {
                name: 'Records',
                data: hasReasonData ? travel_reason_records : [],
                colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            },
        ],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}%',
                    style: { color: '#1f2937', fontSize: '12px' },
                },
                showInLegend: false,
            },
        },
        legend: { enabled: false },
        credits: { enabled: false },
        tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            borderRadius: 8,
            shadow: true,
            padding: 8,
            style: { color: '#1f2937', fontSize: '12px' },
            pointFormat: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
        },
        responsive: {
            rules: [
                {
                    condition: { maxWidth: 500 },
                    chartOptions: { chart: { height: 200 } },
                },
            ],
        },
    };

    // Records by Sex
    const hasSexData = sex_records.length > 0;
    const sexChartOptions = {
        chart: {
            type: 'pie',
            height: 300,
            backgroundColor: 'transparent',
        },
        title: { text: null },
        series: [
            {
                name: 'Records',
                data: hasSexData ? sex_records : [],
                colors: ['#3b82f6', '#f59e0b', '#10b981'],
            },
        ],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}%',
                    style: { color: '#1f2937', fontSize: '12px' },
                },
                showInLegend: false,
            },
        },
        legend: { enabled: false },
        credits: { enabled: false },
        tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            borderRadius: 8,
            shadow: true,
            padding: 8,
            style: { color: '#1f2937', fontSize: '12px' },
            pointFormat: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
        },
        responsive: {
            rules: [
                {
                    condition: { maxWidth: 500 },
                    chartOptions: { chart: { height: 200 } },
                },
            ],
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
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

                {/* Tabbed Charts */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="travel-date">Records Over Time</TabsTrigger>
                                <TabsTrigger value="travel-reason">By Travel Reason</TabsTrigger>
                                <TabsTrigger value="sex">By Sex</TabsTrigger>
                            </TabsList>
                            <TabsContent value="travel-date" className="h-[300px]">
                                {hasTravelData ? (
                                    <HighchartsReact highcharts={Highcharts} options={travelChartOptions} />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-500">
                                        No travel date data available
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="travel-reason" className="h-[300px]">
                                {hasReasonData ? (
                                    <HighchartsReact highcharts={Highcharts} options={reasonChartOptions} />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-500">
                                        No travel reason data available
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="sex" className="h-[300px]">
                                {hasSexData ? (
                                    <HighchartsReact highcharts={Highcharts} options={sexChartOptions} />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-500">
                                        No sex data available
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
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

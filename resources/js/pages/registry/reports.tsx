import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, AlertCircle, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Registry {
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
    note: string;
    travel_reason: string;
    border_post: string;
    destination_coming_from: string;
}

interface SavedReport {
    id: number;
    name: string;
    selectedColumns: string[];
    filters: Record<string, string>;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

interface Props {
    registries?: Registry[];
    savedReports?: SavedReport[];
    errors?: Record<string, string>;
}

const availableColumns = [
    { id: 'surname', label: 'Surname' },
    { id: 'given_name', label: 'Given Name' },
    { id: 'nationality', label: 'Nationality' },
    { id: 'country_of_residence', label: 'Country of Residence' },
    { id: 'document_type', label: 'Document Type' },
    { id: 'document_no', label: 'Document No.' },
    { id: 'dob', label: 'Date of Birth' },
    { id: 'age', label: 'Age' },
    { id: 'sex', label: 'Sex' },
    { id: 'travel_date', label: 'Travel Date' },
    { id: 'direction', label: 'Direction' },
    { id: 'accommodation_address', label: 'Accommodation Address' },
    { id: 'note', label: 'Note' },
    { id: 'travel_reason', label: 'Travel Reason' },
    { id: 'border_post', label: 'Border Post' },
    { id: 'destination_coming_from', label: 'Destination/Coming From' },
];

function Reports({ registries = [], savedReports = [], errors = {} }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        nationality: '',
        sex: '',
        travel_date_from: '',
        travel_date_to: '',
        travel_reason: '',
        direction: '',
    });
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [reportName, setReportName] = useState('');
    const [formError, setFormError] = useState('');

    // Reset form when dialog opens
    useEffect(() => {
        if (isDialogOpen) {
            setFormError('');
            setSelectedColumns([]);
            setFilters({
                nationality: '',
                sex: '',
                travel_date_from: '',
                travel_date_to: '',
                travel_reason: '',
                direction: '',
            });
            setSortBy('');
            setSortOrder('asc');
            setReportName('');
        }
    }, [isDialogOpen]);

    const handleColumnChange = (columnId: string) => {
        setSelectedColumns((prev) =>
            prev.includes(columnId)
                ? prev.filter((id) => id !== columnId)
                : [...prev, columnId]
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleCreateReport = () => {
        if (selectedColumns.length === 0) {
            setFormError('Please select at least one column.');
            return;
        }
        router.post('/registry/reports/generate', {
            selectedColumns,
            filters,
            sortBy,
            sortOrder,
        }, {
            onError: () => {
                setFormError('Failed to generate report. Please check your inputs.');
            },
            onSuccess: () => {
                setIsDialogOpen(false);
            },
        });
    };

    const handleSaveReport = () => {
        if (!reportName) {
            setFormError('Please provide a report name.');
            return;
        }
        if (selectedColumns.length === 0) {
            setFormError('Please select at least one column.');
            return;
        }
        router.post('/registry/reports/save', {
            name: reportName,
            selectedColumns,
            filters,
            sortBy,
            sortOrder,
        }, {
            onError: () => {
                setFormError('Failed to save report. Please try again.');
            },
            onSuccess: () => {
                setIsDialogOpen(false);
            },
        });
    };

    const handleLoadSavedReport = (report: SavedReport) => {
        setSelectedColumns(report.selectedColumns);
        setFilters(report.filters);
        setSortBy(report.sortBy);
        setSortOrder(report.sortOrder);
        router.post('/registry/reports/generate', {
            selectedColumns: report.selectedColumns,
            filters: report.filters,
            sortBy: report.sortBy,
            sortOrder: report.sortOrder,
        });
    };

    const handleExport = (format: 'csv' | 'pdf') => {
        if (selectedColumns.length === 0) {
            setFormError('Please generate a report before exporting.');
            return;
        }
        router.post(`/registry/reports/export/${format}`, {
            selectedColumns,
            filters,
            sortBy,
            sortOrder,
        });
    };

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    {errors && Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {Object.values(errors)[0]}
                            </AlertDescription>
                        </Alert>
                    )}
                    {formError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}

                    {/* Saved Reports */}
                    {savedReports.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Saved Reports</h3>
                            <div className="space-y-2">
                                {savedReports.map((report) => (
                                    <Button
                                        key={report.id}
                                        variant="outline"
                                        className="w-full text-left"
                                        onClick={() => handleLoadSavedReport(report)}
                                    >
                                        {report.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Create Report</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Report</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                {/* Report Name */}
                                <div>
                                    <label className="block text-sm font-medium">Report Name (Optional)</label>
                                    <Input
                                        value={reportName}
                                        onChange={(e) => setReportName(e.target.value)}
                                        placeholder="e.g., Monthly Worker Report"
                                    />
                                </div>

                                {/* Column Selection */}
                                <div>
                                    <h3 className="text-lg font-medium">Select Columns</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {availableColumns.map((column) => (
                                            <div key={column.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={column.id}
                                                    checked={selectedColumns.includes(column.id)}
                                                    onCheckedChange={() => handleColumnChange(column.id)}
                                                />
                                                <label htmlFor={column.id}>{column.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Filters */}
                                <div>
                                    <h3 className="text-lg font-medium">Filters</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="block text-sm font-medium">Nationality</label>
                                            <Input
                                                value={filters.nationality}
                                                onChange={(e) => handleFilterChange('nationality', e.target.value)}
                                                placeholder="e.g., Vanuatu"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Sex</label>
                                            <Select
                                                value={filters.sex}
                                                onValueChange={(value) => handleFilterChange('sex', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select sex" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Travel Date From</label>
                                            <Input
                                                type="date"
                                                value={filters.travel_date_from}
                                                onChange={(e) => handleFilterChange('travel_date_from', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Travel Date To</label>
                                            <Input
                                                type="date"
                                                value={filters.travel_date_to}
                                                onChange={(e) => handleFilterChange('travel_date_to', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Travel Reason</label>
                                            <Select
                                                value={filters.travel_reason}
                                                onValueChange={(value) => handleFilterChange('travel_reason', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select reason" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PALM (Long)">PALM (Long)</SelectItem>
                                                    <SelectItem value="RSE - Recognised Seasonal Employer">
                                                        RSE
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Direction</label>
                                            <Select
                                                value={filters.direction}
                                                onValueChange={(value) => handleFilterChange('direction', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select direction" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Entry">Entry</SelectItem>
                                                    <SelectItem value="Exit">Exit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Sorting */}
                                <div>
                                    <h3 className="text-lg font-medium">Sort By</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="block text-sm font-medium">Column</label>
                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select column" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableColumns.map((column) => (
                                                        <SelectItem key={column.id} value={column.id}>
                                                            {column.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Order</label>
                                            <Select
                                                value={sortOrder}
                                                onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select order" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="asc">Ascending</SelectItem>
                                                    <SelectItem value="desc">Descending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <Button onClick={handleCreateReport}>Generate Report</Button>
                                    <Button variant="outline" onClick={handleSaveReport}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Report
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Report Preview */}
                    {registries.length > 0 && (
                        <div className="mt-2">
                            <div className="flex justify-end space-x-2 mb-4">
                                <Button variant="outline" onClick={() => handleExport('csv')}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                                <Button variant="outline" onClick={() => handleExport('pdf')}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Export PDF
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {selectedColumns.map((col) => (
                                            <TableHead key={col}>
                                                {availableColumns.find((c) => c.id === col)?.label}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registries.map((registry, index) => (
                                        <TableRow key={index}>
                                            {selectedColumns.map((col) => (
                                                <TableCell key={col}>{registry[col]}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Apply the AppLayout to the Reports page
Reports.layout = page => <AppLayout children={page} />;

export default Reports;

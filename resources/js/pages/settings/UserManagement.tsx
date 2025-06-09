import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react'; // Removed Inertia import
import { Inertia } from '@inertiajs/inertia'; // Added correct import for Inertia
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        label: 'User management',
        href: '/settings/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function UserManagement() {
    const { auth, users } = usePage<SharedData & { users: User[] }>().props;
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.name || !data.email || !data.password) {
            alert('Name, email, and password are required');
            return;
        }
        post('/settings/users', {
            data,
            onSuccess: () => {
                console.log('User added successfully');
                setOpen(false);
                reset();
                window.location.reload();
            },
            onError: (err) => {
                console.error('Errors:', err);
                alert(Object.values(err).join(', ') || 'An error occurred while adding the user');
            },
        });
    };

    const handleRoleChange = (userId: number, role: string) => {
        fetch(`/settings/users/${userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
        }).then(response => {
            if (response.ok) {
                console.log(`Updated role for user ${userId} to ${role}`);
            }
        });
    };

    const handleDelete = (userId: number) => {
        console.log('Delete button clicked for userId:', userId);
        Inertia.delete(`/settings/users/${userId}`, {
            onSuccess: () => {
                console.log(`Deleted user ${userId}`);
                window.location.reload();
            },
            onError: (err) => {
                console.error('Delete Errors:', err);
                alert(Object.values(err).join(', ') || 'Failed to delete user');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="User Management" />
            <SettingsLayout>
                <div className="space-y-6" style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 16px', overflowX: 'hidden' }}>
                    <div className="flex justify-between items-center">
                        <HeadingSmall title="User Management" description="Manage users and their roles" />
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>Add User</Button>
                            </DialogTrigger>
                            <DialogContent aria-describedby="dialog-description">
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddUser} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter name"
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter email"
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter password"
                                            required
                                        />
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="role">Role</Label>
                                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            Add User
                                        </Button>
                                    </div>
                                </form>
                                <p id="dialog-description" className="text-sm text-gray-500">
                                    Add a new user by providing their name, email, password, and route.
                                </p>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {users && users.length > 0 ? (
                        <div className="overflow-x-auto max-w-full">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-4 py-2 text-sm text-gray-900">{user.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900">
                                            {user.email === 'htevilili@vanuatu.gov.vu' ? (
                                                <span className="font-medium">Admin</span>
                                            ) : (
                                                <Select
                                                    defaultValue={user.role}
                                                    onValueChange={(value) => handleRoleChange(user.id, value)}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="user">User</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(user.id)}
                                                disabled={user.email === 'htevilili@vanuatu.gov.vu'}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No users available</p>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

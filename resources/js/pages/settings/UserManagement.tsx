import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            alert('Name and email are required');
            return;
        }
        fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, role }),
        }).then(response => {
            if (response.ok) {
                console.log('User added successfully');
                setOpen(false);
                setName('');
                setEmail('');
                setRole('user');
                window.location.reload();
            } else {
                alert('Failed to add user');
            }
        });
    };

    const handleRoleChange = (userId: number, role: string) => {
        fetch(`/users/${userId}/role`, {
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
        fetch(`/users/${userId}`, {
            method: 'DELETE',
        }).then(response => {
            if (response.ok) {
                console.log(`Deleted user ${userId}`);
                window.location.reload();
            }
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
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddUser} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role">Role</Label>
                                        <Select value={role} onValueChange={setRole}>
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Add User</Button>
                                    </div>
                                </form>
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

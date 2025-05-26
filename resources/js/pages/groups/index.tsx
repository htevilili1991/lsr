import { Head, usePage, router } from '@inertiajs/react';
import { PageProps, User, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Role {
    id: number;
    name: string;
    permissions: { name: string }[];
}

interface Permission {
    id: number;
    name: string;
}

interface Props extends PageProps {
    auth: {
        user: User | null;
    };
    groups: Role[];
    permissions: Permission[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const GroupManagement: React.FC = () => {
    const { auth, groups, permissions, flash } = usePage<Props>().props;
    const [newGroupName, setNewGroupName] = useState('');
    const [editingGroup, setEditingGroup] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [showAlert, setShowAlert] = useState(!!flash?.success || !!flash?.error);

    if (!auth.user?.permissions?.includes('view groups')) {
        return (
            <AppLayout auth={auth} breadcrumbs={[{ href: '/dashboard', label: 'Dashboard' }]}>
                <Head title="Access Denied" />
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p className="text-red-600">Access Denied: You do not have permission to view this page.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('groups.store'), { name: newGroupName }, {
            onSuccess: () => setNewGroupName(''),
            preserveScroll: true,
        });
    };

    const handleEditGroup = (group: Role) => {
        setEditingGroup(group);
        setSelectedPermissions(group.permissions.map(p => p.name));
    };

    const handleUpdateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGroup) {
            router.put(route('groups.update', editingGroup.id), { name: editingGroup.name }, {
                onSuccess: () => setEditingGroup(null),
                preserveScroll: true,
            });
        }
    };

    const handleDeleteGroup = (group: Role) => {
        if (confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
            router.delete(route('groups.destroy', group.id), { preserveScroll: true });
        }
    };

    const handleAssignPermissions = (group: Role) => {
        router.post(route('groups.permissions', group.id), { permissions: selectedPermissions }, {
            onSuccess: () => setEditingGroup(null),
            preserveScroll: true,
        });
    };

    const togglePermission = (permissionName: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionName)
                ? prev.filter(p => p !== permissionName)
                : [...prev, permissionName]
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/groups', label: 'Group Management' },
    ];

    return (
        <AppLayout auth={auth} breadcrumbs={breadcrumbs}>
            <Head title="Group Management" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                {showAlert && (flash?.success || flash?.error) && (
                    <Alert
                        variant={flash?.success ? 'default' : 'destructive'}
                        className={`mb-4 p-4 rounded ${flash?.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                        <AlertDescription>
                            {flash?.success ? 'Success! ' : 'Error! '}
                            {flash?.success || flash?.error}
                        </AlertDescription>
                    </Alert>
                )}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Group Management</h2>

                    <form onSubmit={handleCreateGroup} className="mb-8">
                        <h3 className="text-lg font-semibold mb-2">Create New Group</h3>
                        <div className="flex items-center gap-4">
                            <Input
                                type="text"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                placeholder="Enter group name"
                                className="max-w-md"
                            />
                            <Button type="submit" disabled={!newGroupName}>
                                Create Group
                            </Button>
                        </div>
                    </form>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-2">Existing Groups</h3>
                        {groups.length === 0 ? (
                            <p className="text-gray-500">No groups available.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {groups.map(group => (
                                    <li key={group.id} className="py-4 flex justify-between items-center">
                                        <span>{group.name}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleEditGroup(group)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteGroup(group)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {editingGroup && (
                        <form onSubmit={handleUpdateGroup} className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Edit Group: {editingGroup.name}</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <Input
                                    type="text"
                                    value={editingGroup.name}
                                    onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                                    placeholder="Enter group name"
                                    className="max-w-md"
                                />
                                <Button type="submit" disabled={!editingGroup.name}>
                                    Update Group
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setEditingGroup(null)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                    Cancel
                                </Button>
                            </div>
                            <h4 className="text-md font-semibold mb-2">Assign Permissions</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {permissions.map(permission => (
                                    <label key={permission.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(permission.name)}
                                            onChange={() => togglePermission(permission.name)}
                                            className="mr-2"
                                        />
                                        {permission.name}
                                    </label>
                                ))}
                            </div>
                            <Button
                                type="button"
                                onClick={() => handleAssignPermissions(editingGroup)}
                                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                            >
                                Save Permissions
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default GroupManagement;

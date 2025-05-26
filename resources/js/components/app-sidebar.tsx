import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type PageProps, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileIcon, LayoutGrid, UploadIcon, Users } from 'lucide-react';
import AppLogo from './app-logo';

interface Props extends PageProps {
    auth: { user: User | null };
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Registry',
        href: '/registry',
        icon: FileIcon,
    },
    {
        title: 'Upload Data',
        href: '/registry/upload',
        icon: UploadIcon,
    },
    {
        title: 'Group Management',
        href: '/groups',
        icon: Users,
        permission: 'view groups',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<Props>().props;

    // Filter nav items based on permissions
    const filteredMainNavItems = mainNavItems.filter(item =>
        !item.permission || auth.user?.permissions?.includes(item.permission)
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

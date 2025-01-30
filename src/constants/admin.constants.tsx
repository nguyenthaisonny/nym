import { AppstoreOutlined, TeamOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import Link from "next/link";

type MenuItem = Required<MenuProps>['items'][number];
export const sidebarAminItems: MenuItem[] = [
    {
        key: 'grp',
        label: 'nym-application',
        type: 'group',
        children: [
            {
                key: "dashboard",
                label: <Link href={"/dashboard"}>Dashboard</Link>,
                icon: <AppstoreOutlined />,
            },
            {
                key: "user",
                label: <Link href={"/dashboard/user"}>Manage Users</Link>,
                icon: <TeamOutlined />,
            },
            {
                key: 'sub1',
                label: 'Navigation One',
                icon: <MailOutlined />,
                children: [
                    {
                        key: 'g1',
                        label: 'Item 1',
                        type: 'group',
                        children: [
                            { key: '1', label: 'Option 1' },
                            { key: '2', label: 'Option 2' },
                        ],
                    },
                    {
                        key: 'g2',
                        label: 'Item 2',
                        type: 'group',
                        children: [
                            { key: '3', label: 'Option 3' },
                            { key: '4', label: 'Option 4' },
                        ],
                    },
                ],
            },
            {
                key: 'sub2',
                label: 'Navigation Two',
                icon: <AppstoreOutlined />,
                children: [
                    { key: '5', label: 'Option 5' },
                    { key: '6', label: 'Option 6' },
                    {
                        key: 'sub3',
                        label: 'Submenu',
                        children: [
                            { key: '7', label: 'Option 7' },
                            { key: '8', label: 'Option 8' },
                        ],
                    },
                ],
            },
            {
                type: 'divider',
            },
            {
                key: 'sub4',
                label: 'Navigation Three',
                icon: <SettingOutlined />,
                children: [
                    { key: '9', label: 'Option 9' },
                    { key: '10', label: 'Option 10' },
                    { key: '11', label: 'Option 11' },
                    { key: '12', label: 'Option 12' },
                ],
            },
        ],
    },
];
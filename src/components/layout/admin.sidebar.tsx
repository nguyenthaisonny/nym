'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
    TeamOutlined,

} from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext, useAdminContext } from "@/library/contexts/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'
import { sidebarAminItems } from "@/constants/admin.constants";

const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useAdminContext()!;
    return (
        <Sider
            collapsed={collapseMenu}
        >
            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                theme="dark"
                items={sidebarAminItems}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default AdminSideBar;
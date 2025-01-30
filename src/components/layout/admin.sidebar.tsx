'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import React from 'react';
import { useAdminContext } from "@/library/contexts/admin.context";
import { sidebarAminItems } from "@/constants/admin.constants";
import { usePathname } from "next/navigation";

const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useAdminContext()!;
    const path = usePathname();
    const pathElements = path.split("/");
    const currentKey = pathElements[pathElements.length - 1]
    return (
        <Sider
            collapsed={collapseMenu}
        >
            <Menu
                mode="inline"
                defaultSelectedKeys={[currentKey]}
                theme="dark"
                items={sidebarAminItems}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default AdminSideBar;
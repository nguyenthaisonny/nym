'use client'
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, theme } from "antd"
import { useState } from "react";

const { Header } = Layout
const AdminHeader = () => {
      const [collapsed, setCollapsed] = useState(false);

    return (
        <Header style={{ padding: 0, background: "#ccc" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
    )
}
export default AdminHeader
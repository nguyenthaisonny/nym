'use client'
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from "@ant-design/icons"
import { Menu, Layout } from "antd"
const { Sider } = Layout
const AdminSideBar = () => {
    return (
        <Sider trigger={null} collapsible>
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                {
                    key: '1',
                    icon: <UserOutlined />,
                    label: 'nav 1',
                },
                {
                    key: '2',
                    icon: <VideoCameraOutlined />,
                    label: 'nav 2',
                },
                {
                    key: '3',
                    icon: <UploadOutlined />,
                    label: 'nav 3',
                },
                ]}
            />
        </Sider>
    )
}
export default AdminSideBar
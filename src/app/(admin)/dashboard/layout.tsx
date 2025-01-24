import AdminContent from "@/components/layouts/admin.content"
import AdminFooter from "@/components/layouts/admin.footer"
import AdminHeader from "@/components/layouts/admin.header"
import AdminSideBar from "@/components/layouts/admin.sidebar"
import { Layout } from "antd"
import React from "react"

const AdminLayout = ({children} :  Readonly<{children: React.ReactNode}>) => {
    return (
        <Layout>
            <AdminSideBar/>
            <Layout>
                <AdminHeader/>
                <AdminContent>
                    {children}
                </AdminContent>
                <AdminFooter/>
            </Layout>
      </Layout>
    )
}
export default AdminLayout
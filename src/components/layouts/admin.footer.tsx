'use client'
import { Layout } from "antd"

const { Footer } = Layout
const AdminFooter = () => {
    return (
        <Footer style={{ textAlign: 'center'}}>
            nym ©{new Date().getFullYear()} Created by nguyenthaisonny
        </Footer>
    )
}
export default AdminFooter
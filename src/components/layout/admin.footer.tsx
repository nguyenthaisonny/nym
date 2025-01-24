'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                nym ©{new Date().getFullYear()} Created by @nguyenthaisonny
            </Footer>
        </>
    )
}

export default AdminFooter;
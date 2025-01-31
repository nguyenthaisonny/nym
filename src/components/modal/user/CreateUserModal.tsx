'use client'
import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import BaseModal from "../BaseModal";

interface ICreaUserModalProps {
    isModalOpen: boolean
    setIsModalOpen: (status: boolean) => void
    onFinish?: (value: boolean) => Promise<void>
    items?: itemInput[];
}
const CreateUserModal = ({ 
    isModalOpen,
    setIsModalOpen,
    items = [],
    onFinish = async () => {} 
} : ICreaUserModalProps) => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false)
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    return (
       <BaseModal
            items={items}
            title="Create User"
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            onFinish={onFinish}
       />
    )
}

export default CreateUserModal;
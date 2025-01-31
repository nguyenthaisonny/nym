'use client'
import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";

interface IBaseModalProps {
    title?: string
    isModalOpen: boolean
    setIsModalOpen: (status: boolean) => void
    items?: itemInput[]
    onFinish?: (value: any) => Promise<void>
}
const BaseModal = ({ 
    isModalOpen,
     setIsModalOpen, 
     items = [],
     title = "Base Modal",
     onFinish = async () => {}
    } : 
    IBaseModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const hasMounted = useHasMounted();
    if (!hasMounted) return <></>;
    const handleFinish = async (value: any) => {
        setLoading(true)
        await onFinish(value);
        setLoading(false)
    }
    
    return (
        <>
            <Modal
                title={title}
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                footer={null}
            >
                <Form
                    name="verify"
                    autoComplete="off"
                    layout='vertical'
                    form={form}
                    onFinish={handleFinish}
                >
                    {items.map(({name, label, rules, type, hasFeedback}) => (
                        <Form.Item
                            key={name}
                            label={label}
                            name={name}
                            rules={rules}
                            hasFeedback={hasFeedback}
                        >
                            <Input type={type}/>
                        </Form.Item>
                    ))}
                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default BaseModal;
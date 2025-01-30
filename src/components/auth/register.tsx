'use client'
import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
const Register = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const onFinish = async (values: any) => {
        setLoading(true)
        const {name, email, password} = values
        const res = await sendRequest<IBackendRes<IRegister>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
            method: 'POST',
            body: {
                name, email, password
            }
        })
        if(res?.data) {
            router.push(`/verify/${res?.data?.user?._id}`)
            setLoading(false)
            return
        }
        setLoading(false)
        notification.error({
            message: "Register error",
            description: res?.message
        })
    };
    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    background: "rgba(255, 255, 255, 0.9)",
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <h1>Register</h1>
                    </div>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Name"
                            name="name"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button loading={loading} type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link href={"/"}><ArrowLeftOutlined /> Back to home page</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Đã có tài khoản? <Link href={"/auth/login"}>Login</Link>
                    </div>

                </fieldset>
            </Col>
        </Row>

    )
}

export default Register;
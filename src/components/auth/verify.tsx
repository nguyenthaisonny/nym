'use client'
import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
const Verify = ({
    id
}:
{
id: string
}
) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const onFinish = async (values: any) => {
        setLoading(true)
        const {id, code} = values
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            method: 'POST',
            body: {
                _id: id,
                code
            }
        })
        if(res?.statusCode === 201) {
            // authenticate()
            router.push('/auth/login')
            notification.success({
                message: "Activate successfully",
                description: res?.message
            })
            setLoading(false)
            return;
        }
        setLoading(false)
        notification.error({
            message: "Verify error",
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
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Id"
                            name="id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your id!',
                                },
                            ]}
                            initialValue={id}
                            hidden
                        >
                            <Input disabled/>
                        </Form.Item>
                            <div 
                                style={{
                                    textAlign: 'center'
                                }}
                            >
                                A code has been seen to your email, please check it 😊.
                            </div>
                            <Divider/>
                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your code!',
                                },
                            ]}
                        >
                            <Input.Password />
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

export default Verify;
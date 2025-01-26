'use client'
import { Button, Col, Divider, Form, Input, message, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { authenticate } from '@/utils/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendRequest } from '@/utils/api';

const Login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const onFinish = async (values: any) => {
        setLoading(true)
        const {email, password} = values
        const res = await authenticate(email, password)
        if(res?.error) {
            notification.error({
                message: "Error Login",
                description: res.error
            })
            if(res?.code === 2) {
                const res = await sendRequest<IBackendRes<ResendCodeRes>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/resend-code`,
                    method: 'POST',
                    body: {
                        email
                    }
                })
                if(res.statusCode !== 201) {
                    notification.error({
                        message: "Error to regenerate active code",
                        description: res.error
                    })
                }
                router.push(`/verify/${res?.data?.user?._id}`)
            }
            setLoading(false)
            return
        }
        notification.success({
            message: "Login successfully",
            description: res.error
        })
        router.push('/dashboard')
        // setLoading(false)
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Login</legend>
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
                        >
                            <Button loading={loading} type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link href={"/"}><ArrowLeftOutlined /> Back to home page</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Not have an account? <Link href={"/auth/register"}>Register here</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    )
}

export default Login;
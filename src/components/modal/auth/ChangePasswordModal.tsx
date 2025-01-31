'use client'
import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from "react";
import { sendRequest } from "@/utils/api";
interface ModalReactiveProps {
    isModalOpen: boolean
    setIsModalOpen: (status: boolean) => void
}
const ModalChangePassword = ({ isModalOpen, setIsModalOpen }: ModalReactiveProps) => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userId, setUserId] = useState("");
    const [loading, setloading] = useState(false)
    const hasMounted = useHasMounted();


    if (!hasMounted) return <></>;

    const onFinishStep0 = async (values: any) => {
        setloading(true)
        const { email } = values;
        const res = await sendRequest<IBackendRes<ResendCodeRes>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-password`,
            method: "POST",
            body: {
                email
            }
        })
        if (res?.data) {
            setUserId(res?.data?.user?._id)
            setCurrent(1);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }
        setloading(false)
    }

    const onFinishStep1 = async (values: any) => {
        setloading(true)
        const { code, password } = values;
         const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forgot-password`,
                method: 'POST',
                body: {
                    _id: userId,
                    code,
                    newPassword: password
                }
            })
        if (res?.data) {
            setCurrent(2);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }
        setloading(false)
    }
    const handleCancel = () => {
        if(current === 2) setCurrent(0)
        setIsModalOpen(false)
    }
    return (
        <>
            <Modal
                title="Forgot Password"
                open={isModalOpen}
                onCancel={handleCancel}
                maskClosable={false}
                footer={null}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Email',
                            // status: 'finish',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            // status: 'finish',
                            icon: <SolutionOutlined />,
                        },

                        {
                            title: 'Done',
                            // status: 'wait',
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 &&
                    <>

                        <div style={{ margin: "20px 0" }}>
                            <p>In order to recover your password please type your email</p>
                        </div>
                        <Form
                            name="change-password"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout='vertical'
                            form={form}
                        >
                            <Form.Item
                                label=""
                                name="email"
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
                    </>
                }

                {current === 1 &&
                    <>
                        <div style={{ margin: "20px 0" }}>
                            <p>Please update your new password</p>
                        </div>

                        <Form
                            name="change-pass-2"
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout='vertical'
                        >
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
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The new password that you entered do not match!'));
                                    },
                                }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>


                            <Form.Item
                            >
                                <Button loading={loading} type="primary" htmlType="submit">
                                    Confirm
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }

                {current === 2 &&
                    <div style={{ margin: "20px 0" }}>
                        <p>Your password has been changed successfully. Please login again!</p>
                    </div>
                }
            </Modal>
        </>
    )
}

export default ModalChangePassword;
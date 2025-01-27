'use client'

import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
interface ModalReactiveProps {
    isModalOpen: boolean
    setIsModalOpen: (status: boolean) => void
    userEmail: string
}
const ModalReactive = ({ isModalOpen, setIsModalOpen, userEmail } : ModalReactiveProps) => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false)
    const hasMounted = useHasMounted();


    useEffect(() => {
        if (userEmail) {
            form.setFieldValue("email", userEmail)
        }
    }, [userEmail]);

    if (!hasMounted) return <></>;

    const onFinishStep0 = async (values: any) => {
        setLoading(true)
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/resend-code`,
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
        setLoading(false)
    }

    const onFinishStep1 = async (values: any) => {
        setLoading(true)
        const { code } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            method: "POST",
            body: {
                 _id: userId,
                 code
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
        setLoading(false)
    }
    return (
        <>
            <Modal
                title="Activating account"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                footer={null}


            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Login',
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
                            <p>Your account is not active</p>
                        </div>
                        <Form
                            name="verify"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout='vertical'
                            form={form}
                        >
                            <Form.Item
                                label=""
                                name="email"
                            >
                                <Input disabled value={userEmail} />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button loading={loading} type="primary" htmlType="submit">
                                    Resend
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }

                {current === 1 &&
                    <>
                        <div style={{ margin: "20px 0" }}>
                            <p>Please type the verify code again</p>
                        </div>

                        <Form
                            name="verify2"
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
                            >
                                <Button loading={loading} type="primary" htmlType="submit">
                                    Active
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }

                {current === 2 &&
                    <div style={{ margin: "20px 0" }}>
                        <p>Tải khoản của bạn đã được kích hoạt thành công. Vui lòng đăng nhập lại</p>
                    </div>
                }
            </Modal>
        </>
    )
}

export default ModalReactive;
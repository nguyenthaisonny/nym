'use client'
import { Button, Col, Divider, Form, Input, message, notification, Row } from 'antd';
import { ArrowLeftOutlined, QuestionCircleFilled } from '@ant-design/icons';
import Link from 'next/link';
import { authenticate } from '@/utils/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ModalReactive from '../modal/auth/ReactiveModal';
import ModalChangePassword from '../modal/auth/ChangePasswordModal';



const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpenActiveModal, setIsOpenActiveModal] = useState(false);
  const [isOpenForgotModal, setIsOpenForgotModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleOpenActiveModal = (status: boolean) => {
    setLoading(false);
    setIsOpenActiveModal(status);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const { email, password } = values;
    const res = await authenticate(email, password);
    if (res?.error) {
      notification.error({
        message: "Error Login",
        description: res.error,
      });
      if (res?.code === 2) {
        setUserEmail(email);
        handleOpenActiveModal(true);
      }
      setLoading(false);
      return;
    }
    notification.success({
      message: "Login successfully",
      description: res.error,
    });
    router.push("/dashboard");
  };

  return (
      <Row justify={"center"} style={{ marginTop: "30px", position: "relative", zIndex: 1 }}>
        <Col xs={24} md={16} lg={8}>
          <fieldset
            style={{
              padding: "15px",
              margin: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              background: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <h1>Login</h1>
            </div>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link href={"/"}>
                <ArrowLeftOutlined /> Back to home page
              </Link>
              <span
                style={{ textDecoration: "underline", color: "#1677ff", cursor: "pointer" }}
                onClick={() => setIsOpenForgotModal(true)}
              >
                Forgot your password <QuestionCircleFilled />
              </span>
            </div>
            <Divider />
            <div style={{ textAlign: "center" }}>
              Not have an account? <Link href={"/auth/register"}>Register here</Link>
            </div>
          </fieldset>
          <ModalReactive
            isModalOpen={isOpenActiveModal}
            setIsModalOpen={handleOpenActiveModal}
            userEmail={userEmail}
          />
          <ModalChangePassword
            isModalOpen={isOpenForgotModal}
            setIsModalOpen={setIsOpenForgotModal}
          />
        </Col>
      </Row>

  );
};

export default Login;

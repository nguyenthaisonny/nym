import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, Modal, Row } from 'antd';

interface BaseModalProps {
    title?: string;
    isOpen?: boolean;
    hideOpenButton?: boolean;
    items?: itemInput[];
    setStateOpen?: (status: boolean) => void; 
    onSubmit?: (data: any) => Promise<void>       
}

const BaseModal = ({
    title = 'BaseModal',
    isOpen = false,
    hideOpenButton = false,
    items = [],
    setStateOpen = () => {},  
    onSubmit = async () => {},      
}: BaseModalProps) => {
const [loading, setLoading] = useState(false)
  const showModal = () => {
    setStateOpen(true); 
  };

  const handleCancel = () => {
    setStateOpen(false); 
  };

  const onFinish = async (values: any) => {
    setLoading(true)
    await onSubmit(values) 
    setStateOpen(false);
  };

  return (
    <>
        {!hideOpenButton ? (
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
        ) : null}
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <Modal 
                    title={title} 
                    open={isOpen}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <fieldset style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px"
                    }}>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            {items.map(({ label, name, rules }) => (
                                <Form.Item
                                    key={name}
                                    label={label}
                                    name={name}
                                    rules={rules}
                                >
                                    <Input />
                                </Form.Item>
                            ))}
                            <Divider />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button loading={loading} type="primary" htmlType="submit">
                                    Resend
                                </Button>
                            </div>
                        </Form>
                    </fieldset>
                </Modal>
            </Col>
        </Row>
    </>
  );
};

export default BaseModal;

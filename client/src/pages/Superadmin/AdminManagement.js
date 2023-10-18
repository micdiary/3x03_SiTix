import React, { useEffect, useState } from "react";
import { Table, Modal, Form, Input, Row, Col, Typography, Space } from "antd";
import Modals from "../../components/Modal";
import Buttons from "../../components/Buttons";
import { inputStyle, marginBottomOneStyle, tableStyle } from "../PagesStyles";
import { getToken } from "../../utils/account";
import { addNewAdmin, getAdmins } from "../../api/admin";
import { showNotification } from "../../components/Notification";

const AdminManagement = () => {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        getAdmins()
            .then((res) => {
                console.log(res.admins);
                setData(res.admins);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    }, []);

    const handleAddAdmin = () => {
        setModalVisible(true);
    };

    const submitAddAdminForm = (values) => {
        const req = {
            token: getToken(),
            username: values.admin_username,
            admin_email: values.admin_email,
        };
        addNewAdmin(req)
            .then((res) => {
                console.log("success");
                showNotification(res.message);
            })
            .catch((err) => {
                showNotification(err.message);
            })
            .finally(() => {
                form.resetFields();
                setModalVisible(false);
            });
    };

    const handleModalOk = () => {
        form.submit();
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const showDeleteConfirmation = (admin) => {
        Modal.confirm({
            title: "Confirm Delete",
            content: `Are you sure you want to permanently delete ${admin.name}?`,
            onOk: () => handleDelete(admin.adminID),
            okText: "Delete",
        });
    };

    const handleDelete = (adminID) => {};

    const columns = [
        {
            title: "Admin ID",
            dataIndex: "admin_id",
            key: "admin_id",
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Typography.Link
                        onClick={() => showDeleteConfirmation(record)}
                        style={{ color: "red", cursor: "pointer" }}
                    >
                        Delete
                    </Typography.Link>
                </Space>
            ),
        },
    ];

    const modalForm = (formItems) => {
        return formItems.map((item, index) => (
            <Form.Item
                name={item.name}
                rules={item.rules}
                key={index}
                valuePropName={item.valuePropName}
                style={marginBottomOneStyle}
            >
                {item.input}
            </Form.Item>
        ));
    };

    const formItems = [
        {
            name: "admin_username",
            rules: [
                {
                    required: true,
                    message: "Please enter your username.",
                },
                {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message:
                        "Username can only contain letters, numbers, and underscores.",
                },
            ],
            input: <Input style={inputStyle} placeholder="Username" />,
        },
        {
            name: "admin_email",
            rules: [
                {
                    required: true,
                    message: "Enter a valid Email.",
                    type: "email",
                },
            ],
            input: <Input style={inputStyle} placeholder="Email" />,
        },
    ];

    return (
        <div style={{ minHeight: "100vh" }}>
            <Row justify="center" align="middle">
                <Typography.Title level={3}>Super Admin</Typography.Title>
                <Col xs={23} sm={23} md={22} lg={22}>
                    <Row justify="end" style={{ margin: "15px 0" }}>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <div>
                                <Buttons
                                    text="Add Admin"
                                    onClick={handleAddAdmin}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Table
                        dataSource={data}
                        columns={columns}
                        style={tableStyle}
                        pagination={{ pageSize: 5 }}
                    />

                    <Modals
                        modal2Open={modalVisible}
                        closeModal={handleModalCancel}
                        modalTitle={"Add New Admin"}
                        modalContent={
                            <Form form={form} onFinish={submitAddAdminForm}>
                                {modalForm(formItems)}
                            </Form>
                        }
                        onOk={handleModalOk}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default AdminManagement;

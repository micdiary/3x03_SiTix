import React, { useState } from "react";
import { Table, Modal, Form, Input, Row, Col, Typography, Space } from "antd";
import Modals from "../../components/Modal";
import Buttons from "../../components/Buttons";
import { inputStyle, marginBottomOneStyle, tableStyle } from "../PagesStyles";

const AdminManagement = () => {
    // const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [addMode, setAddMode] = useState(false);

    const handleEdit = () => {
        setAddMode(false);
        setModalVisible(true);
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

    const handleAddAdmin = () => {
        setAddMode(true);
        setModalVisible(true);
    };

    const handleModalOk = () => {
        setModalVisible(false);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const dummyData = [
        {
            adminID: 1,
            name: "Admin 1",
            username: "admin1",
            email: "admin1@example.com",
        },
        {
            adminID: 2,
            name: "Admin 2",
            username: "admin2",
            email: "admin2@example.com",
        },
        {
            adminID: 3,
        },
        {
            adminID: 4,
        },
        {
            adminID: 5,
        },
        {
            adminID: 6,
        },
    ];

    const columns = [
        {
            title: "Admin ID",
            dataIndex: "adminID",
            key: "adminID",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
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
                    <Typography.Link onClick={() => handleEdit(record)}>
                        Edit
                    </Typography.Link>
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
            name: "name",
            rules: [
                {
                    required: true,
                },
                {
                    pattern: /^[a-zA-Z\s]+$/,
                    message: "Letters only.",
                },
            ],
            input: <Input style={inputStyle} placeholder="Name" />,
        },
        {
            name: "username",
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
            name: "email",
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
                        dataSource={dummyData}
                        columns={columns}
                        style={tableStyle}
                        pagination={{ pageSize: 5 }}
                    />

                    <Modals
                        modal2Open={modalVisible}
                        closeModal={handleModalCancel}
                        modalTitle={addMode ? "Add New Admin" : "Edit Admin"}
                        modalContent={
                            <Form>
                                {addMode && modalForm(formItems)}
                                {!addMode && modalForm(formItems.slice(0, 2))}
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

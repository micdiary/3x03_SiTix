import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Select,
    Typography,
    Upload,
} from "antd";
import { addVenue } from "../../api/venue";
import Buttons from "../../components/Buttons";
import { showNotification } from "../../components/Notification";
import { cardStyle, inputStyle, marginBottomOneStyle } from "../PagesStyles";
import { useNavigate } from "react-router";
import { ADMIN_URL } from "../../constants";

const AddVenue = () => {
    let navigate = useNavigate();
    const { Option } = Select;
    const [venueForm] = Form.useForm();
    const [categoryCount, setCategoryCount] = useState(1);

    const onFinish = (values) => {
        const seatArray = [];
        for (let i = 0; i < categoryCount; i++) {
            seatArray.push({
                type_name: values[`type_name[${i}]`],
                description: values[`description[${i}]`],
            });
        }

        const req = {
            venue_name: values.venue_name,
            seat_type: JSON.stringify(seatArray),
            file: values.image.file,
        };

        addVenue(req)
            .then((res) => {
                console.log("success");
                showNotification(res.message);
                navigate(ADMIN_URL);
            })
            .catch((err) => {
                showNotification(err.message);
            })
            .finally(() => {
                venueForm.resetFields();
                setCategoryCount(1);
            });
    };

    const addEventFormItem = [
        {
            label: "Venue Name",
            name: "venue_name",
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        },
        {
            label: "No. of Seat Types",
            name: "seat_types_count",
            rules: [{ required: true, message: "Required" }],
            input: (
                <Select onChange={(value) => setCategoryCount(value)}>
                    {Array.from({ length: 10 }, (_, index) => (
                        <Option key={index + 1} value={index + 1}>
                            {index + 1}
                        </Option>
                    ))}
                </Select>
            ),
        },
        // Conditional rendering of seat type input fields
        ...Array.from({ length: categoryCount }, (_, index) => ({
            label: `Seat Type ${index + 1}`,
            name: `type_name[${index}]`,
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        })),
        ...Array.from({ length: categoryCount }, (_, index) => ({
            label: `Description ${index + 1}`,
            name: `description[${index}]`,
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        })),
        {
            label: "Image Upload",
            name: "image",
            rules: [{ required: true, message: "Required" }],
            input: (
                <Upload
                    name="image"
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                >
                    <Button style={inputStyle} icon={<PlusOutlined />}>
                        Upload Image
                    </Button>
                </Upload>
            ),
        },
    ];

    return (
        <div>
            <Row justify="center">
                <Col span={23}>
                    <Card style={{ margin: "40px", ...cardStyle }}>
                        <Typography.Title
                            level={3}
                            style={marginBottomOneStyle}
                        >
                            Add Venue
                        </Typography.Title>
                        <Form
                            form={venueForm}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            {addEventFormItem.map((item) => (
                                <Form.Item
                                    label={item.label}
                                    name={item.name}
                                    rules={item.rules}
                                    key={item.name}
                                >
                                    {item.input}
                                </Form.Item>
                            ))}
                            <Row justify="center">
                                <Buttons text="Submit" width="20%" />
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AddVenue;

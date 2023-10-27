import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Typography,
    Upload,
} from "antd";
import dayjs from "dayjs";
import * as constants from "../../constants";
import React, { useEffect, useState } from "react";
import Buttons from "../../components/Buttons";
import { showNotification } from "../../components/Notification";
import { cardStyle, inputStyle, marginBottomOneStyle } from "../PagesStyles";
import { getVenue } from "../../api/venue";
import { addEvent } from "../../api/event";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
    let navigate = useNavigate();
    const { Option } = Select;
    const [eventForm] = Form.useForm();
    const [venueData, setVenueData] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [categoryCount, setCategoryCount] = useState(0);

    useEffect(() => {
        getVenue()
            .then((res) => {
                const venues = res.venues.map((venue) => ({
                    ...venue,
                    key: venue.admin_id,
                }));
                setVenueData(venues);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    });

    useEffect(() => {
        if (selectedVenue) {
            setCategoryCount(selectedVenue.seat_type.length);
        }
    }, [selectedVenue]);

    const onFinish = (values) => {
        const seatType = [];
        for (let i = 0; i < categoryCount; i++) {
            seatType.push({
                seat_type_id: selectedVenue
                    ? selectedVenue.seat_type[i].seat_type_id
                    : "",
                price: values[`price[${i}]`],
                available_seats: values[`available_seats[${i}]`],
            });
        }
        const req = {
            venue_id: selectedVenue ? selectedVenue.venue_id : "",
            event_name: values.event_name,
            date: values.event_date,
            description: values.event_description,
            category: values.category,
            seat_type: JSON.stringify(seatType),
            file: values.event_image.file,
        };
        addEvent(req)
            .then((res) => {
                showNotification(res.message);
                eventForm.resetFields();
                navigate(constants.ADMIN_URL);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    const addEventFormItem = [
        {
            label: "Event Name",
            name: "event_name",
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        },
        {
            label: "Event Date",
            name: "event_date",
            rules: [{ required: true, message: "Required" }],
            input: (
                <DatePicker
                    showTime={{
                        defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                    }}
                    style={inputStyle}
                />
            ),
        },
        {
            label: "Event Image Upload",
            name: "event_image",
            rules: [{ required: true, message: "Required" }],
            input: (
                <Upload
                    name="image"
                    listType="picture"
                    beforeUpload={() => false}
                >
                    <Button style={inputStyle} icon={<PlusOutlined />}>
                        Upload Image
                    </Button>
                </Upload>
            ),
        },
        {
            label: "Event Venue",
            name: "event_venue",
            rules: [{ required: true, message: "Required" }],
            input: (
                <Select
                    onChange={(value) => {
                        const selected = venueData.find(
                            (venue) => venue.venue_name === value
                        );
                        setSelectedVenue(selected);
                    }}
                >
                    {venueData.map((venue) => (
                        <Option
                            key={venue.venue_id}
                            value={venue.venue_name}
                        ></Option>
                    ))}
                </Select>
            ),
        },
        ...Array.from({ length: categoryCount }, (_, index) => ({
            label: `Price (${
                selectedVenue.seat_type[index] &&
                selectedVenue.seat_type[index].type_name
            })`,
            name: `price[${index}]`,
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        })),
        ...Array.from({ length: categoryCount }, (_, index) => ({
            label: `Available Seats (${
                selectedVenue.seat_type[index] &&
                selectedVenue.seat_type[index].type_name
            })`,
            name: `available_seats[${index}]`,
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        })),
        {
            label: "Category",
            name: "category",
            rules: [{ required: true, message: "Required" }],
            input: (
                <Select
                    options={[
                        { value: "sports", label: "Sports" },
                        { value: "concerts", label: "Concerts" },
                        { value: "comedy", label: "Comedy" },
                    ]}
                />
            ),
        },
        {
            label: "Event Description",
            name: "event_description",
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
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
                            Add Event
                        </Typography.Title>
                        <Form
                            form={eventForm}
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

export default AddEvent;

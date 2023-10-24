import {
    Collapse,
    Space,
    Typography,
    Button,
    Form,
    Input,
    Select,
    Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { getVenue, updateVenue } from "../../api/venue";
import { showNotification } from "../../components/Notification";
import Modals from "../../components/Modal";
import { inputStyle, marginBottomOneStyle } from "../PagesStyles";

const Venue = () => {
    const { Option } = Select;
    const [modalVisible, setModalVisible] = useState(false);
    const [categoryCount, setCategoryCount] = useState(1);
    const [editVenueID, setEditVenueID] = useState(null);
    const [venueName, setVenueName] = useState("");
    const [venueData, setVenueData] = useState([]);
    const [updated, setUpdated] = useState([]);
    const [form] = Form.useForm();

    // display venue
    useEffect(() => {
        getVenue()
            .then((res) => {
                console.log(res.venues);
                const venues = res.venues.map((venue) => ({
                    ...venue,
                    key: venue.admin_id,
                }));
                setVenueData(venues);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    }, [updated]);

    const editVenue = (venueId) => (
        <Space>
            <Typography.Link
                onClick={() => handleEditVenue(venueId)}
                style={{ color: "black" }}
            >
                Edit
            </Typography.Link>
        </Space>
    );

    const items = venueData.map((venue) => ({
        key: venue.venue_id,
        label: venue.venue_name,
        children: (
            <div>
                <p>Name: {venue.venue_name}</p>
                <img src={venue.img} alt={venue.venue_name} />
                <p>Seat Types:</p>
                <ul>
                    {venue.seat_type.map((type, typeIndex) => (
                        <div key={typeIndex}>
                            <p>
                                {type.type_name} : {type.description}
                            </p>
                        </div>
                    ))}
                </ul>
            </div>
        ),
        extra: editVenue(venue.venue_id),
    }));

    // edit venue
    const handleEditVenue = (venueId) => {
        const selectedVenue = venueData.find(
            (venue) => venue.venue_id === venueId
        );

        form.setFieldsValue({
            venue_name: selectedVenue.venue_name,
            seat_types_count: selectedVenue.seat_type.length,
            image: selectedVenue.img,
        });

        for (let i = 0; i < selectedVenue.seat_type.length; i++) {
            form.setFieldsValue({
                [`seat_type_id[${i}]`]: selectedVenue.seat_type[i].seat_type_id,
                [`type_name[${i}]`]: selectedVenue.seat_type[i].type_name,
                [`description[${i}]`]: selectedVenue.seat_type[i].description,
            });
        }
        setCategoryCount(selectedVenue.seat_type.length);
        setVenueName(selectedVenue.venue_name);
        setEditVenueID(venueId);
        setModalVisible(true);
    };

    const submitEditForm = (values) => {
        const seatArray = [];
        for (let i = 0; i < categoryCount; i++) {
            seatArray.push({
                seat_type_id: values[`seat_type_id[${i}]`],
                type_name: values[`type_name[${i}]`],
                description: values[`description[${i}]`],
            });
        }
        const req = {
            venue_id: editVenueID,
            venue_name: values.venue_name,
            seat_type: JSON.stringify(seatArray),
            file: values.image.file,
        };
        updateVenue(req)
            .then((res) => {
                showNotification(res.message);
                setModalVisible(false);
                setUpdated(!updated);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    const modalForm = (formItems) => {
        return formItems.map((item, index) => (
            <Form.Item
                label={item.label}
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
            label: "Venue Name",
            name: "venue_name",
            input: <Input style={inputStyle} />,
        },
        {
            label: "No. of Seat Types",
            name: "seat_types_count",
            input: (
                <Select disabled onChange={(value) => setCategoryCount(value)}>
                    {Array.from({ length: 10 }, (_, index) => (
                        <Option key={index + 1} value={index + 1}>
                            {index + 1}
                        </Option>
                    ))}
                </Select>
            ),
        },
        ...Array.from({ length: categoryCount }, (_, index) => ({
            label: `Seat Type ID ${index + 1}`,
            name: `seat_type_id[${index}]`,
            input: <Input disabled />,
        })),
        ...Array.from({ length: categoryCount }, (_, index) => ({
            label: `Seat Type ${index + 1}`,
            name: `type_name[${index}]`,
            input: <Input style={inputStyle} />,
        })),
        ...Array.from({ length: categoryCount }, (_, index) => ({
            label: `Description ${index + 1}`,
            name: `description[${index}]`,
            input: <Input style={inputStyle} />,
        })),
        {
            label: "Image Upload",
            name: "image",
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

    const handleModalOk = () => {
        form.submit();
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <div className="container">
            <Collapse
                items={items}
                defaultActiveKey={["1"]}
                onChange={onChange}
            />

            <Modals
                modal2Open={modalVisible}
                closeModal={handleModalCancel}
                modalTitle={`Edit ${venueName}`}
                modalContent={
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={submitEditForm}
                    >
                        {modalForm(formItems)}
                    </Form>
                }
                onOk={handleModalOk}
            />
        </div>
    );
};

export default Venue;

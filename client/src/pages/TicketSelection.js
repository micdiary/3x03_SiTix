import React, { useState } from "react";
import * as constants from "../constants";
import { useNavigate } from "react-router-dom";
import Buttons from "../components/Buttons";
import seatingMap from "../assets/Capitol_Seating_Map-1.png";
import { Row, Col, Typography, Table, Select, Divider } from "antd";

const TicketSelection = () => {
    let navigate = useNavigate();

    const nextButton = () => {
        navigate(constants.PURCHASE_URL);
    };

    const dummyPricingTable = [
        {
            category: "Cat 1",
            color: "#EDE83F",
            price: "128",
        },
        {
            category: "Cat 2",
            color: "#32A6DA",
            price: "98",
        },
        {
            category: "Cat 3",
            color: "#EF5454",
            price: "68",
        },
        {
            category: "Cat 4",
            color: "#5FBA46",
            price: "48",
        },
    ];

    const priceColumns = [
        {
            title: "Color",
            dataIndex: "color",
            key: "color",
            render: (color) => (
                <div
                    style={{
                        width: "30px",
                        height: "15px",
                        backgroundColor: color,
                    }}
                ></div>
            ),
            width: "10%",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (text) => `$${text}`,
        },
    ];

    const [selectedTicketType, setSelectedTicketType] = useState("Cat 1");
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const ticketColumns = [
        {
            title: "*Ticket Type",
            dataIndex: "ticketType",
            key: "ticketType",
            render: () => (
                <Select
                    style={{ width: "100%" }}
                    value={selectedTicketType}
                    onChange={(value) => setSelectedTicketType(value)}
                >
                    {dummyPricingTable.map((pricingItem) => (
                        <Select.Option
                            key={pricingItem.category}
                            value={pricingItem.category}
                        >
                            {pricingItem.category}
                        </Select.Option>
                    ))}
                </Select>
            ),
            width: "30%",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: () => {
                const selectedPrice = dummyPricingTable.find(
                    (item) => item.category === selectedTicketType
                );
                return `$${selectedPrice ? selectedPrice.price : 0}`;
            },
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: () => (
                <Select
                    style={{ width: "100%" }}
                    value={selectedQuantity}
                    onChange={(value) => setSelectedQuantity(value)}
                >
                    {[1, 2, 3, 4].map((value) => (
                        <Select.Option key={value} value={value}>
                            {value}
                        </Select.Option>
                    ))}
                </Select>
            ),
            width: "20%",
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: () => {
                const selectedPrice = dummyPricingTable.find(
                    (item) => item.category === selectedTicketType
                );
                const total = selectedPrice
                    ? selectedPrice.price * selectedQuantity
                    : 0;
                return `$${total}`;
            },
        },
    ];

    return (
        <div style={{ minHeight: "100vh" }}>
            <Row justify="center" align="middle">
                <Col xs={22} sm={20} md={20} lg={20}>
                    <Row justify="center">
                        <Typography.Title level={5} style={{ color: "red" }}>
                            Timer
                        </Typography.Title>
                    </Row>
                    <Typography.Title level={2}> Event Name </Typography.Title>
                    <Typography.Title level={5}> Event Venue </Typography.Title>
                    <div align="middle">
                        <img
                            src={seatingMap}
                            alt="Seating Map"
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </div>
                    <Row>
                        <Col xs={14} sm={12} md={10} lg={8}>
                            <Table
                                dataSource={dummyPricingTable}
                                columns={priceColumns}
                                pagination={false}
                                showHeader={false}
                                size="small"
                                rowKey={(record) => record.category}
                            />
                            <Typography.Title level={5}>Note:</Typography.Title>
                            <Typography.Text>
                                Ticket prices do not include booking fees.
                                <br /> Seat plan is not drawn to scale.
                            </Typography.Text>
                        </Col>
                    </Row>
                    <Divider />
                    <Typography.Title level={4}>
                        Pick Your Seat:
                    </Typography.Title>
                </Col>
            </Row>

            <Row justify="center" align="middle">
                <Col xs={22} sm={20} md={20} lg={20}>
                    <Table
                        dataSource={[{ ticketType: selectedTicketType }]}
                        columns={ticketColumns}
                        pagination={false}
                        size="small"
                        rowKey={() => "ticketType"}
                        style={{ marginTop: "10px" }}
                    />
                    <Typography.Text italic style={{ fontSize: "11px" }}>
                        *We will find you the best available seat in the section
                        you have selected. If you are purchasing more than one
                        ticket, we will do our best to locate consecutive seats.
                    </Typography.Text>
                    <Row justify="end" style={{ marginTop: "20px" }}>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <div>
                                <Buttons text="Next" onClick={nextButton} />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
export default TicketSelection;

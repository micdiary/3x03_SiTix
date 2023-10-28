import React, { useState } from "react";
import * as constants from "../../constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Buttons from "../../components/Buttons";
import { Row, Col, Typography, Table, Select, Divider } from "antd";
import { eventStore, purchaseStore } from "../../store/Order";

const TicketSelection = () => {
    let navigate = useNavigate();
    let location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const event_id = queryParams.get("event");

    const eventData = eventStore((state) => state.eventData);

    const dataSource = eventData.seat_type.map((seat) => {
        const seatId = eventData.venue_seat_type.find(
            (type) => type.seat_type_id === seat.seat_type_id
        );
        return {
            description: seatId ? seatId.description : "Unknown",
            type_name: seatId ? seatId.type_name : "Unknown Type",
            price: seat.price,
            key: seat.seat_type_id,
        };
    });

    const priceColumns = [
        {
            title: "Color",
            dataIndex: "description",
            key: "description",
            render: (description) => (
                <div
                    style={{
                        width: "30px",
                        height: "15px",
                        backgroundColor: description,
                    }}
                ></div>
            ),
            width: "10%",
        },
        {
            dataIndex: "type_name",
            key: "type_name",
        },
        {
            dataIndex: "price",
            key: "price",
            render: (text) => `$${text}`,
        },
    ];

    const [selectedTicket, setSelectedTicket] = useState(
        eventData.venue_seat_type[0].type_name
    );
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const ticketColumns = [
        {
            title: "Ticket Type",
            dataIndex: "type_name",
            key: "type_name",
            render: () => (
                <Select
                    style={{ width: "100%" }}
                    value={selectedTicket}
                    onChange={(value) => setSelectedTicket(value)}
                >
                    {dataSource.map((item) => (
                        <Select.Option
                            key={item.seat_type_id}
                            value={item.type_name}
                        >
                            {item.type_name}
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
                const selectedPrice = dataSource.find(
                    (item) => item.type_name === selectedTicket
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
                const selectedPrice = dataSource.find(
                    (item) => item.type_name === selectedTicket
                );
                const total = selectedPrice
                    ? selectedPrice.price * selectedQuantity
                    : 0;
                return `$${total}`;
            },
            width: "25%",
        },
    ];

    const nextButton = () => {
        const purchaseData = {
            ticket: selectedTicket,
            quantity: selectedQuantity,
        };
        purchaseStore.setState({ purchaseData });
        navigate(`${constants.PURCHASE_URL}?event=${event_id}`);
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <Row justify="center" align="middle">
                <Col xs={22} sm={20} md={20} lg={20}>
                    <Typography.Title level={2}>
                        {eventData.event_name}
                    </Typography.Title>
                    <Typography.Title level={5}>
                        {eventData.venue.venue_name}
                    </Typography.Title>
                    <div align="middle">
                        <img
                            src={`data:image/jpg;base64,${eventData.venue.img}`}
                            alt={eventData.venue.venue_name}
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </div>
                    <Row style={{ margin: "10px 0" }}>
                        <Col xs={14} sm={12} md={10} lg={8}>
                            <Table
                                dataSource={dataSource}
                                columns={priceColumns}
                                pagination={false}
                                showHeader={false}
                                size="small"
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
                        dataSource={[{ ticketType: selectedTicket }]}
                        columns={ticketColumns}
                        pagination={false}
                        size="small"
                        rowKey={() => "ticketType"}
                        style={{ marginTop: "10px" }}
                    />
                    <Typography.Text italic style={{ fontSize: "11px" }}>
                        *Please note that this is free seating within the
                        seating section.
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

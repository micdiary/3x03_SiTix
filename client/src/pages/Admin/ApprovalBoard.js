import { Collapse, Space, Typography } from "antd";
import React from "react";

const ApprovalBoard = () => {
    const dummyData = [
        {
            eventTitle: "d4vd",
            eventVenue: "venue",
            eventDate: "date",
            eventDay: "day",
            eventTime: "time",
            eventCat: "cat",
            eventPrice: "price",
            totalSeats: "total seat",
        },
        {
            eventTitle: "seventeen",
            eventVenue: "venue",
            eventDate: "date",
            eventDay: "day",
            eventTime: "time",
            eventCat: "cat",
            eventPrice: "price",
            totalSeats: "total seat",
        },
        {
            eventTitle: "seventeen",
            eventVenue: "venue",
            eventDate: "date",
            eventDay: "day",
            eventTime: "time",
            eventCat: "cat",
            eventPrice: "price",
            totalSeats: "total seat",
        },
    ];

    const genApproval = (index) => (
        <Space>
            <Typography.Link
                onClick={() => handleApprove(index)}
                style={{ color: "green" }}
            >
                Approve
            </Typography.Link>
            <Typography.Link
                onClick={() => handleReject(index)}
                style={{ color: "red" }}
            >
                Reject
            </Typography.Link>
        </Space>
    );

    const items = dummyData.map((data, index) => ({
        key: `${index + 1}`,
        label: data.eventTitle,
        children: (
            <div>
                <p>Event Title: {data.eventTitle}</p>
                <p>Event Venue: {data.eventVenue}</p>
                <p>Event Date: {data.eventDate}</p>
                <p>Event Day: {data.eventDay}</p>
                <p>Event Time: {data.eventTime}</p>
                <p>Category: {data.eventCat}</p>
                <p>Price: {data.eventPrice}</p>
                <p>Total Seat: {data.totalSeats}</p>
            </div>
        ),
        extra: genApproval(index),
    }));

    const handleApprove = (index) => {
        console.log(`Approved event at index ${index}`);
    };

    const handleReject = (index) => {
        console.log(`Rejected event at index ${index}`);
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
        </div>
    );
};

export default ApprovalBoard;

import { Collapse, Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getEventDetails } from "../../api/event";
import { showNotification } from "../../components/Notification";
import { updateRequest } from "../../api/request";
import { getToken } from "../../utils/account";

const ApprovalBoard = ({ eventData, updatedReq, setUpdatedReq }) => {
    const [detailsData, setDetailsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = [];
            for (let i = 0; i < eventData.length; i++) {
                try {
                    const res = await getEventDetails({
                        event_id: eventData[i].event_id,
                    });
                    data.push(res.event);
                } catch (err) {
                    showNotification(err.message);
                }
            }
            setDetailsData(data);
        };
        fetchData();
    }, [eventData]);

    const genApproval = (requestId) => (
        <Space>
            <Typography.Link
                onClick={() => handleApprove(requestId)}
                style={{ color: "green" }}
            >
                Approve
            </Typography.Link>
            <Typography.Link
                onClick={() => handleReject(requestId)}
                style={{ color: "red" }}
            >
                Reject
            </Typography.Link>
        </Space>
    );

    const items =
        detailsData &&
        detailsData.map((event) => {
            const eventAdmin = eventData.find(
                (data) => data.event_id === event.event_id
            );

            const seatTypeSource = event.seat_type.map((type, typeIndex) => ({
                key: typeIndex,
                seatAvailable: type.available_seats,
                seatPrice: type.price,
                venueSeat: event.venue_seat_type[typeIndex].type_name,
            }));

            const columns = [
                {
                    title: "Seat Type",
                    dataIndex: "venueSeat",
                    key: "venueSeat",
                },
                {
                    title: "Price",
                    dataIndex: "seatPrice",
                    key: "seatPrice",
                },
                {
                    title: "No. of Seats",
                    dataIndex: "seatAvailable",
                    key: "seatAvailable",
                },
            ];

            return {
                key: event.event_id,
                label: event.event_name,
                children: (
                    <div>
                        <Table
                            dataSource={[
                                {
                                    key: "1",
                                    label: "Admin",
                                    value: eventAdmin && eventAdmin.admin,
                                },
                                {
                                    key: "2",
                                    label: "Event Title",
                                    value: event.event_name,
                                },
                                {
                                    key: "3",
                                    label: "Event Date",
                                    value: event.date,
                                },
                                {
                                    key: "4",
                                    label: "Event Venue",
                                    value: event.venue.venue_name,
                                },
                                {
                                    key: "5",
                                    label: "Description",
                                    value: event.description,
                                },
                                {
                                    key: "6",
                                    label: "Category",
                                    value: event.category,
                                },
                                {
                                    key: "7",
                                    label: "Status",
                                    value: event.status,
                                },
                            ]}
                            columns={[
                                {
                                    dataIndex: "label",
                                    key: "label",
                                },
                                {
                                    dataIndex: "value",
                                    key: "value",
                                },
                            ]}
                            pagination={false}
                        />
                        <Typography.Title level={4}>
                            Seat Types:
                        </Typography.Title>
                        <Table
                            dataSource={seatTypeSource}
                            columns={columns}
                            pagination={{ pageSize: 3 }}
                        />
                        <img
                            src={`data:image/jpg;base64,${event.banner_img}`}
                            alt={event.event_name}
                        />
                    </div>
                ),
                extra: genApproval(eventAdmin && eventAdmin.request_id),
            };
        });

    const handleApprove = (requestId) => {
        const req = {
            token: getToken(),
            request_id: requestId,
            status: "accepted",
        };
        updateRequest(req)
            .then((res) => {
                showNotification(res.message);
                setUpdatedReq(!updatedReq);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    const handleReject = (requestId) => {
        const req = {
            token: getToken(),
            request_id: requestId,
            status: "rejected",
        };
        updateRequest(req)
            .then((res) => {
                showNotification(res.message);
                setUpdatedReq(!updatedReq);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    return (
        <div>
            <Collapse items={items} defaultActiveKey={["1"]} />
        </div>
    );
};

export default ApprovalBoard;

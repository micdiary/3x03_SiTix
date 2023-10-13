import { Collapse, Space, Typography } from "antd";
import React from "react";

const ApprovalBoard = () => {
    const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
    const genApproval = () => (
        <Space>
            <Typography.Link
                onClick={() => handleApprove()}
                style={{ color: "green" }}
            >
                Approve
            </Typography.Link>
            <Typography.Link
                onClick={() => handleReject()}
                style={{ color: "red" }}
            >
                Reject
            </Typography.Link>
        </Space>
    );
    const items = [
        {
            key: "1",
            label: "Event Title 1",
            children: <p>{text}</p>,
            extra: genApproval(),
        },
        {
            key: "2",
            label: "Event Title 2",
            children: <p>{text}</p>,
            extra: genApproval(),
        },
        {
            key: "3",
            label: "Event Title 3",
            children: <p>{text}</p>,
            extra: genApproval(),
        },
    ];
    const handleApprove = () => {};
    const handleReject = () => {};

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

import { Collapse, Space, Typography } from "antd";
import React from "react";

const Venue = () => {
    const dummyName = ["capitol", "singapore sports hall"];
    const dummyImage = ["some image", "image"];
    const deleteVenue = () => (
        <Space>
            <Typography.Link
                onClick={() => handleDelete()}
                style={{ color: "red" }}
            >
                Delete
            </Typography.Link>
        </Space>
    );

    const items = dummyName.map((name, index) => ({
        key: `${index + 1}`,
        label: name,
        children: (
            <div>
                <p>Name : {name}</p>
                <img src={dummyImage[index]} alt={name} />
            </div>
        ),
        extra: deleteVenue(`${index + 1}`),
    }));

    // const items = [
    //     {
    //         key: "1",
    //         label: "capitol",
    //         children: <p>{text}</p>,
    //         extra: deleteVenue(),
    //     },
    //     {
    //         key: "2",
    //         label: "singapore sports hall",
    //         children: <p>{text}</p>,
    //         extra: deleteVenue(),
    //     },
    // ];

    const handleDelete = () => {};

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

export default Venue;

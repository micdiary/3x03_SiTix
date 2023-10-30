import { Card, Typography } from "antd";
import React from "react";

const Category = () => {
    return (
        <div
            className="category"
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <Card
                style={{
                    width: 300,
                    textAlign: "center",
                    background: "transparent",
                }}
            >
                <img
                    src={require("../assets/wip.png")}
                    alt="Work In Progress"
                    style={{ width: "100%" }}
                />
                <Typography.Title level={4}>Work In Progress</Typography.Title>
                <Typography.Text>Please wait for the surprise</Typography.Text>
                <Typography.Text>
                    Our developers are on a coffee break ☕
                </Typography.Text>
            </Card>
        </div>
    );
};

export default Category;

import React from "react";
import { Layout as AntdLayout } from "antd";

import Footer from "./Footer";
import Header from "./Header";
import Home from "../pages/Home";
import Register from "../pages/Register";

const { Header: AntHeader, Content, Footer: AntFooter } = AntdLayout;

const Layout = (page) => {
    console.log(page);
    const renderPage = ({ page }) => {
        switch (page) {
            case "home":
                return <Home />;
            // examples
            case "register":
                return <Register />;
            // case "queue":
            //     return <queue />;
            default:
                return <Home />;
        }
    };

    return (
        <AntdLayout
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <AntHeader style={{ padding: "0px" }}>
                <Header />
            </AntHeader>
            <Content>{renderPage(page)}</Content>
            <AntFooter>
                <Footer />
            </AntFooter>
        </AntdLayout>
    );
};

export default Layout;

import React from "react";
import { Layout as AntdLayout } from "antd";

import Footer from "./Footer";
import Header from "./Header";
import Home from "../pages/Home";
import Event from "../pages/Event";
import Purchase from "../pages/Purchase";
import Category from "../pages/Cateogry";
import TicketSelection from "../pages/TicketSelection";
import Profile from "../pages/Profile";
import History from "../pages/History";
import AdminManagement from "../pages/Superadmin/AdminManagement";
import Admin from "../pages/Admin/Admin";
import EventManagement from "../pages/Admin/EventManagement";

const { Header: AntHeader, Content, Footer: AntFooter } = AntdLayout;

const Layout = (page) => {
    console.log(page);
    const renderPage = ({ page }) => {
        switch (page) {
            case "home":
                return <Home />;
            case "category":
                return <Category />;
            case "event":
                return <Event />;
            case "ticket":
                return <TicketSelection />;
            case "purchase":
                return <Purchase />;
            case "history":
                return <History />;
            case "profile":
                return <Profile />;
            case "superadmin":
                return <AdminManagement />;
            case "admin":
                return <Admin />;
            case "add-event":
                return <EventManagement />;
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

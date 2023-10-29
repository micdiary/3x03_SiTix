import React, { useEffect, useState } from "react";
import { Layout as AntdLayout } from "antd";

import Footer from "./Footer";
import Header from "./Header";
import Home from "../pages/Home";
import Event from "../pages/User/Event";
import Purchase from "../pages/User/Purchase";
import Category from "../pages/Cateogry";
import TicketSelection from "../pages/User/TicketSelection";
import History from "../pages/User/History";
import AdminManagement from "../pages/Superadmin/AdminManagement";
import Admin from "../pages/Admin/Admin";
import AddEvent from "../pages/Admin/AddEvent";
import AddVenue from "../pages/Admin/AddVenue";
import Profile from "../pages/Profile/Profile";

import { getToken, getUserType } from "../utils/account";
import { userStore } from "../store/User";
import ProtectedRoute from "./ProtectedRoute";

const { Header: AntHeader, Content, Footer: AntFooter } = AntdLayout;

const Layout = (page) => {
    const localToken = getToken();
    const storeToken = userStore((state) => state.token);
    const [userID, setUserID] = useState(
        localToken !== null ? localToken : storeToken
    );
    useEffect(() => {
        setUserID(localToken !== null ? localToken : storeToken);
    }, [localToken, storeToken]);

    const [userType, setUserType] = useState(null);
    useEffect(() => {
        setUserType(getUserType());
    });

    const renderPage = ({ page }) => {
        switch (page) {
            case "home":
                return <Home />;
            case "category":
                return <Category />;
            case "event":
                return <Event />;
            case "ticket":
                return (
                    <ProtectedRoute user={userID}>
                        <TicketSelection />
                    </ProtectedRoute>
                );
            case "purchase":
                return (
                    <ProtectedRoute user={userID}>
                        <Purchase />
                    </ProtectedRoute>
                );
            case "history":
                return (
                    <ProtectedRoute user={userID}>
                        <History />
                    </ProtectedRoute>
                );
            case "profile":
                return (
                    <ProtectedRoute user={userID}>
                        <Profile />
                    </ProtectedRoute>
                );
            case "superadmin":
                return (
                    <ProtectedRoute user={userID}>
                        <AdminManagement />
                    </ProtectedRoute>
                );
            case "admin":
                return (
                    <ProtectedRoute user={userID}>
                        <Admin />
                    </ProtectedRoute>
                );
            case "add-event":
                return (
                    <ProtectedRoute user={userID}>
                        <AddEvent />
                    </ProtectedRoute>
                );
            case "add-venue":
                return (
                    <ProtectedRoute user={userID}>
                        <AddVenue />
                    </ProtectedRoute>
                );
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
            <Content>{renderPage(page, userID)}</Content>
            <AntFooter>
                <Footer />
            </AntFooter>
        </AntdLayout>
    );
};

export default Layout;

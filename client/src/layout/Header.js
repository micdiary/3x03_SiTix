import React, { useEffect, useState } from "react";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import * as constants from "../constants";
import { useMediaQuery } from "react-responsive";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { userStore } from "../store/User";
import {
    getToken,
    getUserType,
    removeToken,
    removeUserType,
} from "../utils/account";
import { refreshToken } from "../api/account";

const hrefStyle = { color: "black" };
const logoStyle = { fontSize: "20px" };
const hamburgerStyle = {
    fontSize: "16px",
    cursor: "pointer",
    paddingRight: "30px",
};
const headerStyle = {
    display: "flex",
    padding: "0px 24px",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

const Header = () => {
    const storeToken = userStore((state) => state.token);
    const setStoreToken = userStore((state) => state.setToken);
    const removeUser = userStore((state) => state.removeUser);
    const localStorageToken = getToken();
    const localStorageUserType = getUserType();

    const [token, setToken] = useState(
        localStorageToken ? localStorageToken : storeToken
    );
    useEffect(() => {
        setToken(localStorageToken !== null ? localStorageToken : storeToken);
        setStoreToken(
            localStorageToken !== null ? localStorageToken : storeToken
        );
        console.log(token);
        if (token !== null && token !== undefined) {
            refreshToken({ token: token })
                .then((res) => {
                    console.log("success");
                    console.log(res);
                })
                .catch((err) => {
                    console.log("fail");
                    console.log(err);
                    alert("token expired, please login again");
                    removeToken();
                    removeUserType();
                    removeUser();
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localStorageToken, storeToken]);

    const isLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

    if (isLaptop) {
        return (
            <div style={headerStyle}>
                <div>
                    <LeftMenu />
                </div>
                <div style={logoStyle}>
                    <a style={hrefStyle} href={constants.HOME_URL}>
                        SiTix
                    </a>
                </div>
                <div>
                    <RightMenu />
                </div>
            </div>
        );
    } else {
        return <MobileMenu />;
    }
};

const MobileMenu = () => {
    const [isDrawerVisible, setDrawerVisible] = React.useState(false);

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    return (
        <div style={headerStyle}>
            <div style={hamburgerStyle} onClick={showDrawer}>
                <MenuOutlined />
            </div>
            <Drawer
                title="Menu"
                placement="right"
                closable={false}
                onClose={closeDrawer}
                open={isDrawerVisible}
            >
                <LeftMenu />
            </Drawer>
            <div style={logoStyle}>
                <a style={hrefStyle} href={constants.HOME_URL}>
                    SiTix
                </a>
            </div>
            <div>
                <RightMenu />
            </div>
        </div>
    );
};

export default Header;

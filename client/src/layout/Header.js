import React, { useEffect, useState } from "react";
import "./Layout.css";
import LeftMenu from "./LeftMenu";
import RightMenu, { RightSuperMenu } from "./RightMenu";
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
                    console.log(err);
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
            <div className="header">
                <div>
                    <LeftMenu />
                </div>
                <div className="logo">
                    <a className="href" href={constants.HOME_URL}>
                        SiTix
                    </a>
                </div>
                <div>
                    <RightMenu token={token} />
                </div>
            </div>
            // <AdminHeader />
        );
    } else {
        return <MobileMenu token={token} />;
    }
};

const MobileMenu = ({ token }) => {
    const [isDrawerVisible, setDrawerVisible] = React.useState(false);

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    return (
        <div className="header">
            <div className="hamburger" onClick={showDrawer}>
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
            <div className="logo">
                <a className="href" href={constants.HOME_URL}>
                    SiTix
                </a>
            </div>
            <div>
                <RightMenu token={token} />
            </div>
        </div>
    );
};

const AdminHeader = () => {
    return (
        <div className="header">
            <div className="logo">
                <a className="href" href={constants.ADMIN_URL}>
                    SiTix
                </a>
            </div>
            <div>
                <RightSuperMenu />
            </div>
        </div>
    );
};

export default Header;

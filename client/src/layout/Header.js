import React from "react";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import * as constants from "../constants";
import { useMediaQuery } from "react-responsive";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";

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

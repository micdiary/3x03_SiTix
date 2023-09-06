import React from "react";

const footerStyle = {
    width: "100%",
    color: "gray",
    fontSize: "12px",
    textAlign: "center",
};

const dividerStyle = {
    width: "90%",
    margin: "0 auto",
    borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
};

const spanStyle = { paddingTop: "30px" };

const Footer = () => {
    return (
        <div style={footerStyle}>
            <div style={dividerStyle}></div>
            <div style={spanStyle}>
                <span>SiTix &copy;2023 created by Team 11</span>
            </div>
        </div>
    );
};

export default Footer;

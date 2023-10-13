import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";

export const buttonWhite = (e) => {
    e.currentTarget.style.backgroundColor = "white";
    e.currentTarget.style.color = "black";
    e.currentTarget.style.border = "2px solid black";
};

export const buttonBlack = (e) => {
    e.currentTarget.style.backgroundColor = "black";
    e.currentTarget.style.color = "white";
    e.currentTarget.style.border = "2px solid white";
};

const Buttons = ({ width, height, marginTop, text, onClick }) => {
    const buttonStyle = {
        width: width || "100%",
        height: height || "50px",
        color: "white",
        borderRadius: "50px",
        marginBotton: "10px",
        backgroundColor: "black",
        marginTop: marginTop || "auto",
        transition: "background-color 0.3s, color 0.3s",
    };

    return (
        <Button
            style={buttonStyle}
            onMouseOver={buttonWhite}
            onMouseOut={buttonBlack}
            htmlType="submit"
            onClick={onClick}
        >
            {text}
        </Button>
    );
};

Buttons.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    marginTop: PropTypes.string,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

export default Buttons;

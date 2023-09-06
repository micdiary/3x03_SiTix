import React from "react";
import { Carousel } from "antd";

const contentStyle = {
    color: "#fff",
    lineHeight: "200px",
    textAlign: "center",
};

const carouselStyle = {
    marginTop: "10px",
    height: "250px",
    background: "black",
};

const Home = () => {
    return (
        <div style={carouselStyle}>
            <Carousel autoplay pauseOnHover={true}>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>last</h3>
                </div>
            </Carousel>
        </div>
    );
};

export default Home;

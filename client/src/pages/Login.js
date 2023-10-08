import React from "react";
import * as constants from "../constants";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row, Form, Input, Button, Typography, Card } from "antd";
import { login } from "../api/account";
import { useNavigate } from "react-router-dom";
import { userStore } from "../store/User";

const aStyle = { color: "#B59410" };
const marginBottomOneStyle = { marginBottom: "25px" };
const marginBottomTwoStyle = { marginBottom: "30px" };
const inputStyle = { height: "50px", borderRadius: "50px" };
const typographyStyle = { textAlign: "center", marginBottom: "30px" };
const cardStyle = { padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" };
const buttonStyle = {
	width: "100%",
	height: "50px",
	color: "white",
	borderRadius: "50px",
	marginBottom: "10px",
	backgroundColor: "black",
	transition: "background-color 0.3s, color 0.3s",
};

const Login = () => {
	let navigate = useNavigate();
	const setStoreToken = userStore((state) => state.setToken);
	const setStoreUserType = userStore((state) => state.setUserType);

	const onFinish = (values) => {
		console.log("Received values of form: ", values);

		const req = {
			username: values.username,
			password: values.password,
		};

		login(req)
			.then((res) => {
				console.log(res);

				// global state
				setStoreToken(res.token);
				setStoreUserType(res.userType);

				// local storage
				localStorage.setItem("token", res.token);
				localStorage.setItem("userType", res.userType);

				// TODO change accordingly depending on usertype
				navigate(constants.HOME_URL);
			})
			.catch((err) => {
				console.log(err);
				alert(err.message);
			});
	};

	const handleButtonMouseOut = (e) => {
		e.currentTarget.style.backgroundColor = "black";
		e.currentTarget.style.color = "white";
	};
	const handleButtonMouseOver = (e) => {
		e.currentTarget.style.backgroundColor = "white";
		e.currentTarget.style.color = "black";
		e.currentTarget.style.border = "2px solid black";
	};

	return (
		<Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
			<Col xs={20} sm={16} md={12} lg={8}>
				<Typography.Title style={typographyStyle} level={1}>
					Login
				</Typography.Title>
				<Card style={cardStyle}>
					<Form
						layout="vertical"
						name="normal_login"
						initialValues={{ remember: true }}
						onFinish={onFinish}
					>
						<Form.Item
							name="username"
							rules={[
								{
									required: true,
									message: "Please enter your Username.",
									type: "name",
								},
							]}
							style={marginBottomOneStyle}
						>
							<Input
								style={inputStyle}
								prefix={<UserOutlined />}
								placeholder="Username"
							/>
						</Form.Item>
						<Form.Item
							name="password"
							rules={[
								{
									required: true,
									message: "Please enter your Password.",
								},
							]}
							style={marginBottomTwoStyle}
						>
							<Input.Password
								style={inputStyle}
								prefix={<LockOutlined />}
								placeholder="Password"
							/>
						</Form.Item>
						<Form.Item>
							<Button
								style={buttonStyle}
								onMouseOut={handleButtonMouseOut}
								onMouseOver={handleButtonMouseOver}
								htmlType="submit"
							>
								Log in
							</Button>
							Or{" "}
							<a style={aStyle} href={constants.REGISTER_URL}>
								register now!
							</a>
						</Form.Item>
					</Form>
				</Card>
			</Col>
		</Row>
	);
};

export default Login;

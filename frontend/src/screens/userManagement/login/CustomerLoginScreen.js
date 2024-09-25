import { Form, Button, Card } from "react-bootstrap";
import MainScreen from "../../../components/MainScreen";
import "./LoginScreen.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import { customerLogin } from "../../../actions/userManagementActions/customerActions";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const CustomerLogin = ({ history }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState(null);

	const googleUrl = "http://localhost:5001/auth/google";

	const dispatch = useDispatch();

	const openInNewTabAndClosePrevious = (url) => {
		const newWindow = window.open(url, "_blank", "noopener,noreferrer");

		if (newWindow) {
			window.close();
			newWindow.opener = null;
		}
	};

	const onClickUrl = (url) => {
		return () => openInNewTabAndClosePrevious(url);
	};

	const customer_Login = useSelector((state) => state.customer_Login);
	const { loading, error, customerInfo, success } = customer_Login;

	useEffect(() => {
		if (customerInfo) {
			window.history.pushState({}, "", "/customer");
		}
	}, [history, customerInfo]);

	// Function to validate email format
	const validateEmail = (email) => {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(String(email).toLowerCase());
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		// Input sanitization: Trim whitespaces
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		// Email validation
		if (!validateEmail(trimmedEmail)) {
			setMessage("Invalid email format");
			return;
		}

		// Password validation (optional: ensure password is at least 6 characters long)
		if (trimmedPassword.length < 6) {
			setMessage("Password must be at least 6 characters long");
			return;
		}

		// Dispatch login action
		await dispatch(customerLogin(trimmedEmail, trimmedPassword));

		setEmail("");
		setPassword("");
		setMessage(null);
	};

	return (
		<div className="loginBg">
			<br />
			<br />
			<MainScreen title="CUSTOMER LOGIN">
				<Card
					className="profileCont"
					style={{
						marginLeft: "10%",
						marginRight: "10%",
						borderRadius: 45,
						borderWidth: 2.0,
						marginTop: 50,
						paddingInline: 35,
						background: "rgba(231, 238, 238, 0.9)",
					}}
				>
					<br />
					<div className="loginContainer">
						{message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
						{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
						{loading && <Loading />}
						{success &&
							setTimeout(() => {
								history.push("/customer");
							}, 2000)}
						<Form onSubmit={submitHandler}>
							<Form.Group controlId="formBasicEmail">
								<Form.Label style={{ fontWeight: "bold", fontStyle: "italic" }}>Email address</Form.Label>
								<Form.Control
									type="email"
									value={email}
									placeholder="Enter Email"
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Form.Group>
							<br />
							<Form.Group controlId="formBasicPassword">
								<Form.Label style={{ fontWeight: "bold", fontStyle: "italic" }}>Password</Form.Label>
								<Form.Control
									type="password"
									value={password}
									placeholder="Password"
									onChange={(e) => setPassword(e.target.value)}
								/>
							</Form.Group>
							<br />
							<Button variant="primary" type="submit">
								Submit
							</Button>

							<br></br>
							<br></br>
						</Form>
						<Button onClick={onClickUrl(`${googleUrl}`)}>Google Auth</Button>
					</div>
				</Card>
			</MainScreen>
		</div>
	);
};

export default CustomerLogin;

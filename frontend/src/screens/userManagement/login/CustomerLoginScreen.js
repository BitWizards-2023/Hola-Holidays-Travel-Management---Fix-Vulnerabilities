import { Form, Button, Card } from "react-bootstrap";
import MainScreen from "../../../components/MainScreen";
import "./LoginScreen.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import { customerLogin } from "../../../actions/userManagementActions/customerActions";
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Import icons from react-icons

const CustomerLogin = ({ history }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const googleUrl = "http://localhost:5001/auth/google";
	const facebookUrl = "http://localhost:5001/auth/facebook";

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

	const submitHandler = async (e) => {
		e.preventDefault();
		await dispatch(customerLogin(email, password));

		setEmail("");
		setPassword("");
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
						{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
						{loading && <Loading />}
						{success &&
							setTimeout(function () {
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

							{/* Flexbox container for buttons */}
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Button variant="primary"
									style={{
										color: 'white',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: '8px', // Add some space between icon and text
									}} type="submit">
									Submit
								</Button>

								<Button
									onClick={onClickUrl(`${googleUrl}`)}
									style={{
										backgroundColor: '#DB4437',
										color: 'white',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: '8px', // Add some space between icon and text
									}}
								>
									<FaGoogle /> Google Auth
								</Button>

								<Button
									onClick={onClickUrl(`${facebookUrl}`)}
									style={{
										backgroundColor: '#4267B2',
										color: 'white',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: '8px', // Add some space between icon and text
									}}
								>
									<FaFacebook /> Facebook Auth
								</Button>
							</div>
						</Form>
					</div>
				</Card>
			</MainScreen>
		</div>
	);
};

export default CustomerLogin;

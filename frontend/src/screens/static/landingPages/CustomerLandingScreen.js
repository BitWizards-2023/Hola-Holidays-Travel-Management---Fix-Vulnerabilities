import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "react-bootstrap";
import { customerLogout } from "../../../actions/userManagementActions/customerActions";
import "./landingScreen.css";
import MainScreen from "../../../components/MainScreen";
import { Link, useHistory } from "react-router-dom";
import { useEffect } from "react";

const CustomerLandingScreen = () => {
	const customer_Login = useSelector((state) => state.customer_Login);
	const { customerInfo } = customer_Login;
	const dispatch = useDispatch();
	const history = useHistory();

	// Redirect to login if customerInfo is not available
	useEffect(() => {
		if (!customerInfo) {
			history.push("/customer-login"); // Redirect to login page if not logged in
		}
	}, [customerInfo, history]);

	const logoutHandler = () => {
		dispatch(customerLogout());
		history.push("/");
	};

	return (
		<div className="customerBackground">
			<MainScreen title={`Welcome Back ${customerInfo ? customerInfo.firstName : "Guest"}...`}>
				<Button
					variant="danger"
					onClick={logoutHandler}
					className="logoutBtn"
					style={{ float: "right", marginTop: 3, fontSize: 15 }}
				>
					Logout
				</Button>

				<br></br>
				<br></br>
				<br></br>
				<div className="loginContainer">
					<Card
						style={{
							borderRadius: 45,
							borderWidth: 2.0,
							marginTop: 20,
							paddingInline: 10,
							background: "rgba(231, 238, 238, 0.8)",
							marginLeft: "20%",
							marginRight: "20%",
						}}
					>
						<div className="intro-text">
							<br></br>
							<br></br>
							{customerInfo && (
								<Link to="/customer-view">
									<Button id="landingBtn" variant="success" size="lg" style={{ width: 350, height: 75 }}>
										My Account
									</Button>
								</Link>
							)}
							<br></br>
							<br></br>
						</div>
						<br></br>
					</Card>
				</div>
			</MainScreen>
		</div>
	);
};

export default CustomerLandingScreen;

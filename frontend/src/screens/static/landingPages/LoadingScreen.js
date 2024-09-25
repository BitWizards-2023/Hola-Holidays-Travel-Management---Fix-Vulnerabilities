import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./LoadingScreen.css";
import MainScreen from "../../../components/MainScreen";

const LoadingScreen = () => {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to check authentication
    const checkAuthentication = async () => {
        try {
            const response = await fetch("http://localhost:5001/auth", {
                method: "GET",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("customerInfo", JSON.stringify(data));
                console.log("Authentication successful:", data);
                setIsAuthenticated(true);  // Set authenticated status to true
            } else {
                throw new Error("Authentication failed");
            }
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const timeout = setTimeout(() => {
                window.location.href = "http://localhost:3000/customer";
            }, 1000);  // Add slight delay after authentication

            return () => clearTimeout(timeout);
        }
    }, [isAuthenticated, history]);

    return (
        <div style={{ background: "black" }}>
            <MainScreen>
                <div className="loading-screen">
                    <div className="loader"></div>
                </div>
            </MainScreen>
        </div>
    );
};

export default LoadingScreen;

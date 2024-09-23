import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./LoadingScreen.css";
import MainScreen from "../../../components/MainScreen";

const LoadingScreen = () => {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Added loading state

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
            setIsAuthenticated(false); // Set authentication to false in case of error
        } finally {
            setLoading(false); // Stop loading once the check is complete
        }
    };

    useEffect(() => {
        // First check if customerInfo already exists in localStorage
        const storedCustomerInfo = localStorage.getItem("customerInfo");
        if (storedCustomerInfo) {
            console.log("User info found in localStorage:", JSON.parse(storedCustomerInfo));
            setIsAuthenticated(true);
            setLoading(false);  // Stop loading since we found the info
        } else {
            checkAuthentication();
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            const timeout = setTimeout(() => {
                if (isAuthenticated) {
                    console.log("User authenticated, redirecting...");
                    history.push("/customer");
                } else {
                    console.log("User not authenticated, staying on login.");
                    history.push("/login");  // Redirect to login if not authenticated
                }
            }, 1000);  // Add slight delay for better UX

            return () => clearTimeout(timeout);
        }
    }, [isAuthenticated, loading, history]);

    // Show loader while checking authentication
    if (loading) {
        return (
            <div style={{ background: "black" }}>
                <MainScreen>
                    <div className="loading-screen">
                        <div className="loader"></div>
                    </div>
                </MainScreen>
            </div>
        );
    }

    return null;  // Return nothing once loading is complete
};

export default LoadingScreen;

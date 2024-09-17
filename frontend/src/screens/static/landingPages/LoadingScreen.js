import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./LoadingScreen.css";
import MainScreen from "../../../components/MainScreen";

const LoadingScreen = () => {
    const history = useHistory();

    // Make an HTTP request to your server to authenticate the user
    fetch("http://localhost:5001/auth", {
        method: "GET",
        credentials: "include", // Include cookies in the request
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Authentication failed");
            }
        })
        .then((data) => {
            localStorage.setItem("customerInfo", JSON.stringify(data));
            console.log(data);
        })
        .catch((error) => {
            console.error("Authentication error:", error);
        });


    useEffect(() => {
        const timeout = setTimeout(() => {
            history.push("/customer");
        }, 2000);

        return () => clearTimeout(timeout);
    }, [history]);

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
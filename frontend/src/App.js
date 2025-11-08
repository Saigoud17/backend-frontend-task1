import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
    const token = localStorage.getItem("token");

    return ( <
        Routes >
        <
        Route path = "/"
        element = { token ? < Navigate to = "/dashboard" / > : < Navigate to = "/login" / > }
        /> <
        Route path = "/register"
        element = { < Register / > }
        /> <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/dashboard"
        element = { token ? < Dashboard / > : < Navigate to = "/login" / > }
        /> <
        /Routes>
    );
};

export default App;
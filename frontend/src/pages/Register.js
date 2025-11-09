import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "https://backend-frontend-task1.onrender.com";

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/dashboard");
    }, [navigate]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/v1/auth/register`, form);
            alert("🎉 Registered successfully! Please login.");
            navigate("/login");
        } catch (err) {
            alert(err?.response?.data?.error || "❌ Registration failed");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account📝</h2>
                <p style={styles.subtitle}>Join us and start managing tasks</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <button type="submit" style={styles.button}>
                        Register
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#e2e8f0",
        fontFamily: "Poppins, sans-serif",
    },
    card: {
        backgroundColor: "#1e293b",
        padding: "40px 50px",
        borderRadius: "15px",
        width: "350px",
        textAlign: "center",
        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    },
    title: { marginBottom: "10px", color: "#38bdf8" },
    subtitle: { fontSize: "14px", color: "#94a3b8", marginBottom: "25px" },
    form: { display: "flex", flexDirection: "column" },
    input: {
        marginBottom: "15px",
        padding: "10px 15px",
        borderRadius: "8px",
        border: "none",
        outline: "none",
        backgroundColor: "#334155",
        color: "#f8fafc",
        fontSize: "14px",
    },
    button: {
        padding: "10px",
        backgroundColor: "#38bdf8",
        border: "none",
        borderRadius: "8px",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
        transition: "0.3s",
    },
    footer: { marginTop: "15px", color: "#cbd5e1" },
    link: { color: "#38bdf8", textDecoration: "none" },
};

export default Register;
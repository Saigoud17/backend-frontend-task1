import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "https://backend-frontend-task1.onrender.com";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out successfully!");
        navigate("/login");
    };

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/v1/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data.tasks || res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchIncomplete = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/v1/tasks/incomplete`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = Array.isArray(res.data) ? res.data : res.data.tasks || res.data;
            setTasks(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/v1/tasks`, newTask, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewTask({ title: "", description: "" });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = currentStatus === "done" ? "todo" : "done";
        try {
            await axios.put(`${API_URL}/api/v1/tasks/${id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await axios.delete(`${API_URL}/api/v1/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>

                <h2>Dashboard</h2>

                <h3>Add Task</h3>
                <form className="task-form" onSubmit={handleCreate}>
                    <input
                        placeholder="Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        required
                    />
                    <button type="submit">Create Task</button>
                </form>

                <div className="tasks-section">
                    <h3>Your Tasks</h3>

                    <div className="filter-buttons">
                        <button className="incomplete" onClick={fetchIncomplete}>
                            Incomplete
                        </button>
                        <button className="all" onClick={fetchTasks}>
                            All
                        </button>
                    </div>

                    <ul className="task-list">
                        {tasks.map((task) => (
                            <li key={task._id || task.id} className="task-item">
                                <b>{task.title}</b> — <i>{task.status}</i>
                                <div>{task.description}</div>
                                <div className="task-buttons">
                                    <button className="done" onClick={() => handleStatusUpdate(task._id || task.id, task.status)}>
                                        {task.status === "done" ? "Undo" : "Done"}
                                    </button>
                                    <button className="delete" onClick={() => handleDelete(task._id || task.id)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
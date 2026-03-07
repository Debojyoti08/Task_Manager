import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskPage.css';

const TaskPage = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTask, setEditingTask] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchTasks();
        }
    }, [token, navigate]);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/task/getall', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data.tasks);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
            setError('Could not fetch tasks. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrUpdateTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (editingTask) {
                // Update
                await axios.put(`http://localhost:3000/api/task/update/${editingTask.id}`,
                    { title, description },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Create
                await axios.post('http://localhost:3000/api/task/create',
                    { title, description },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            setTitle('');
            setDescription('');
            setEditingTask(null);
            fetchTasks();
        } catch (err) {
            console.error('Task operation failed', err);
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        setIsLoading(true);
        try {
            await axios.delete(`http://localhost:3000/api/task/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            console.error('Delete failed', err);
            setError('Could not delete task.');
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingTask(null);
        setTitle('');
        setDescription('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="task-container">
            <header className="task-header">
                <div className="header-content">
                    <h1>Your Tasks</h1>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            <main className="task-main">
                <section className="task-form-section">
                    <div className="task-card form-card">
                        <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                        <form onSubmit={handleCreateOrUpdateTask}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Task title..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What needs to be done?"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : (editingTask ? 'Update Task' : 'Add Task')}
                                </button>
                                {editingTask && (
                                    <button type="button" onClick={cancelEditing} className="cancel-btn">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                        {error && <p className="error-text">{error}</p>}
                    </div>
                </section>

                <section className="task-list-section">
                    {isLoading && tasks.length === 0 ? (
                        <div className="loading-state">Loading your tasks...</div>
                    ) : (
                        <div className="task-grid">
                            {tasks.map(task => (
                                <div key={task.id} className="task-card list-item">
                                    <div className="task-content">
                                        <h3>{task.title}</h3>
                                        <p>{task.description}</p>
                                    </div>
                                    <div className="task-actions">
                                        <button onClick={() => startEditing(task)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                            {tasks.length === 0 && !isLoading && (
                                <div className="empty-state">No tasks yet. Start by adding one!</div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default TaskPage;
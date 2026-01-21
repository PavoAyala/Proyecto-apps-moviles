import { useState, useEffect } from 'react';
import { LogOut, Plus } from 'lucide-react';
import TaskItem from './TaskItem';
import './TaskDashboard.css';

export default function TaskDashboard({ user, onLogout }) {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('admin_tasks');
        return saved ? JSON.parse(saved) : [];
    });
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        localStorage.setItem('admin_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (newTaskTitle.trim()) {
            const newTask = {
                id: Date.now(),
                title: newTaskTitle,
                status: 'In Progress'
            };
            setTasks([newTask, ...tasks]);
            setNewTaskTitle('');
        }
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id
                ? { ...task, status: task.status === 'In Progress' ? 'Finish' : 'In Progress' }
                : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="task-dashboard">
            <header className="dashboard-header">
                <div>
                    <h2>Hola, {user}</h2>
                    <p>Tus tareas para hoy</p>
                </div>
                <button onClick={onLogout} className="logout-button">
                    <LogOut size={20} />
                </button>
            </header>

            <div className="add-task-container">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Nueva tarea..."
                    className="task-input"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button onClick={addTask} className="add-button">
                    <Plus size={24} />
                </button>
            </div>

            <div className="tasks-list">
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                ))}
                {tasks.length === 0 && (
                    <p className="empty-state">No hay tareas pendientes</p>
                )}
            </div>
        </div>
    );
}

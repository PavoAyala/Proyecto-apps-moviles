import { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import './AdminLogin.css';

const USERS = ['Roberto', 'Marlon', 'Patricio'];

export default function AdminLogin({ onLogin, onBack }) {
    const [selectedUser, setSelectedUser] = useState(USERS[0]);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '1234') {
            onLogin(selectedUser);
        } else {
            setError('Contraseña incorrecta');
            setPassword('');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-card">
                <div className="admin-header">
                    <h1>Panel de Empleados</h1>
                    <p>Tacos El Güero</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="input-group">
                        <label>Seleccionar Usuario</label>
                        <div className="select-wrapper">
                            <User className="input-icon" size={20} />
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="admin-input"
                            >
                                {USERS.map(user => (
                                    <option key={user} value={user}>{user}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="PIN de acceso"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="admin-input"
                                maxLength={4}
                            />
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="button-group">
                        <button type="button" onClick={onBack} className="back-button">
                            Volver
                        </button>
                        <button type="submit" className="login-button-green">
                            <span>Ingresar</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import './ClientLogin.css';

export default function ClientLogin({ onLogin }) {
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phone.trim()) {
            onLogin();
        }
    };

    return (
        <div className="client-login-container">
            <div className="login-header">
                <h1>Bienvenido</h1>
                <p>Ingresa tu número para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <User className="input-icon" size={20} />
                    <input
                        type="tel"
                        placeholder="Número de teléfono"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="login-input"
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    <span>Ingresar</span>
                    <ArrowRight size={20} />
                </button>
            </form>
        </div>
    );
}

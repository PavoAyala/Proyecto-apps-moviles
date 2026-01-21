import { User, ShieldCheck } from 'lucide-react';
import './RoleSelection.css';

export default function RoleSelection({ onSelectClient, onSelectAdmin }) {
    return (
        <div className="role-selection-container">
            <div className="role-header">
                <h1>Tacos El Güero</h1>
                <p>Bienvenido, selecciona tu rol</p>
            </div>

            <div className="role-grid">
                <button
                    onClick={onSelectClient}
                    className="role-card client"
                >
                    <div className="icon-box">
                        <User size={32} />
                    </div>
                    <div className="role-info">
                        <h3>Cliente</h3>
                        <p>Quiero ordenar comida</p>
                    </div>
                </button>

                <button
                    onClick={onSelectAdmin}
                    className="role-card admin"
                >
                    <div className="icon-box">
                        <ShieldCheck size={32} />
                    </div>
                    <div className="role-info">
                        <h3>Administrador</h3>
                        <p>Gestionar restaurante</p>
                    </div>
                </button>
            </div>
        </div>
    );
}

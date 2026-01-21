import { Home, Utensils, User } from 'lucide-react';
import './ClientLayout.css';

export default function ClientLayout({ activeTab, onTabChange, children }) {
    return (
        <div className="client-layout">
            <main className="client-content">
                {children}
            </main>

            <nav className="bottom-nav">
                <button
                    className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => onTabChange('home')}
                >
                    <Home size={24} />
                    <span>Inicio</span>
                </button>

                <button
                    className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
                    onClick={() => onTabChange('menu')}
                >
                    <Utensils size={24} />
                    <span>Menú</span>
                </button>

                <button
                    className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
                    onClick={() => onTabChange('account')}
                >
                    <User size={24} />
                    <span>Cuenta</span>
                </button>
            </nav>
        </div>
    );
}

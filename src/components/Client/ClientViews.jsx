import './ClientViews.css';

export function ClientHome() {
    return (
        <div className="client-view home-view">
            <h2>Hola, ¿Qué se te antoja hoy?</h2>
            <div className="promo-card">
                <h3>Tacos al Pastor 2x1</h3>
                <p>Solo hoy jueves</p>
            </div>
        </div>
    );
}

export function ClientMenu() {
    return (
        <div className="client-view menu-view">
            <h2>Nuestro Menú</h2>
            <ul className="menu-list">
                <li>Tacos</li>
                <li>Bebidas</li>
                <li>Postres</li>
            </ul>
        </div>
    );
}

export function ClientAccount() {
    return (
        <div className="client-view account-view">
            <h2>Mi Cuenta</h2>
            <p>Roberto Ayala</p>
            <button className="btn-secondary">Mis Pedidos</button>
        </div>
    );
}

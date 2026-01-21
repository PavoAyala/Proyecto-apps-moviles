import { useState } from 'react';
import RoleSelection from './components/RoleSelection';
import ClientLogin from './components/Client/ClientLogin';
import ClientLayout from './components/Client/ClientLayout';
import { ClientHome, ClientMenu, ClientAccount } from './components/Client/ClientViews';
import AdminLogin from './components/Admin/AdminLogin';
import TaskDashboard from './components/Admin/TaskDashboard';
import './App.css';

function App() {
  const [view, setView] = useState('role_selection'); // role_selection, client_login, client_dashboard, admin_login, admin_dashboard
  const [clientTab, setClientTab] = useState('home');
  const [adminUser, setAdminUser] = useState(null);

  const handleClientLogin = () => {
    setView('client_dashboard');
  };

  const handleAdminLogin = (user) => {
    setAdminUser(user);
    setView('admin_dashboard');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setView('role_selection');
  };

  const renderContent = () => {
    switch (view) {
      case 'role_selection':
        return (
          <RoleSelection
            onSelectClient={() => setView('client_login')}
            onSelectAdmin={() => setView('admin_login')}
          />
        );

      case 'client_login':
        return <ClientLogin onLogin={handleClientLogin} />;

      case 'client_dashboard':
        return (
          <ClientLayout activeTab={clientTab} onTabChange={setClientTab}>
            {clientTab === 'home' && <ClientHome />}
            {clientTab === 'menu' && <ClientMenu />}
            {clientTab === 'account' && <ClientAccount />}
          </ClientLayout>
        );

      case 'admin_login':
        return (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setView('role_selection')}
          />
        );

      case 'admin_dashboard':
        return (
          <TaskDashboard
            user={adminUser}
            onLogout={handleAdminLogout}
          />
        );

      default:
        return <div>Error: Vista desconocida</div>;
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
}

export default App;

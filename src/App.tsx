import { useState } from 'react';
import HomePage from './components/HomePage';
import { GarageFinder } from './components/GarageFinder';
import { GarageRegistration } from './components/GarageRegistration';
import GarageOwnerLogin from "./components/GarageOwner";
import GarageStatsPage from './components/GarageDashboard';
// import {}

type Page = 'home' | 'finder' | 'register' | 'login' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [dashboardData, setDashboardData] = useState<any>(null);

  const navigate = (page: Page, data?: any) => {
    if (data) setDashboardData(data);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={(p) => navigate(p)} />;
      case 'finder':
        return <GarageFinder onBack={() => navigate('home')} />;
      case 'register':
        return <GarageRegistration onBack={() => navigate('home')} />;
      case 'login':
        return <GarageOwnerLogin onNavigate={navigate} />;
      case 'dashboard':
        return <GarageStatsPage {...(dashboardData || {})} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;

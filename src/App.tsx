import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { GarageFinder } from './components/GarageFinder';
import { GarageRegistration } from './components/GarageRegistration';

type Page = 'home' | 'finder' | 'register';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'finder':
        return <GarageFinder onBack={() => setCurrentPage('home')} />;
      case 'register':
        return <GarageRegistration onBack={() => setCurrentPage('home')} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;

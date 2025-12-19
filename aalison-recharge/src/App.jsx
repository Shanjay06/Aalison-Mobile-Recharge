import { Routes, Route } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Navbar from './Components/navbar';
import Footer from './Components/footer';
import HomePage from './pages/HomePage';
import PlansPage from './pages/PlansPage';
import PaymentPage from './pages/PaymentPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import EnhancedAdminDashboard from './pages/EnhancedAdminDashboard';
import SimpleAdminLogin from './pages/SimpleAdminLogin';
import ImprovedLoginPage from './pages/ImprovedLoginPage';
import SimpleLogin from './pages/SimpleLogin';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#1a1a1a' : '#f8f9fa',
      cardBg: isDarkMode ? '#2d2d2d' : 'white',
      text: isDarkMode ? '#ffffff' : '#333333',
      textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
      border: isDarkMode ? '#404040' : '#f0f0f0',
      primary: '#e60012'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: theme.colors.background,
        color: theme.colors.text,
        transition: 'all 0.3s ease'
      }}>
        <Navbar />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<ImprovedLoginPage />} />
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/admin" element={<EnhancedAdminDashboard />} />
            <Route path="/admin-login" element={<SimpleAdminLogin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
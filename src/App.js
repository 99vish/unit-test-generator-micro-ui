import logo from './logo.svg';
import './App.css';
import LandingPage from './pages/LandingPage';
import Background from './pages/BackgroundPage';
import SelectionPage from './pages/SelectionPage';
import { useState } from 'react';

function App() {
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [showClassesAndMethodSelectionPage, setShowClassesAndMethodSelectionPage] = useState(false);
  
  const handleExcelClick = () => {
    setShowLandingPage(true);
    setShowClassesAndMethodSelectionPage(false);
  };

  const handleSelectionClick = () => {
    setShowClassesAndMethodSelectionPage(true);
    setShowLandingPage(false);
  };

  return (
    <div className="App">
      <Background />
      <div className='Options'>
        {!showLandingPage && !showClassesAndMethodSelectionPage && (
          <>
          <h3 onClick={handleExcelClick} className='option'>Upload Excel File for input test cases</h3>
          <h3>OR</h3>
          <h3 onClick={handleSelectionClick} className='option'>Select Classes And Methods</h3>
          </>
        )}
      </div>
      <div className='component'>
        {showLandingPage && <LandingPage />}
        {showClassesAndMethodSelectionPage && <SelectionPage />}
      </div>
    </div>
  );
}

export default App;

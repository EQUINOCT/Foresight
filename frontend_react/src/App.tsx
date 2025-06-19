// App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useConfig } from './ConfigContext'; // Import the useConfig hook
import MonitorScreen from './components/Screens/MonitorScreen';
import AboutScreen from './components/Screens/AboutScreen';
import SettingScreen from './components/Screens/SettingScreen';
import MainLayout from './MainLayout';
import MonitorAnalyticsScreen from './components/Screens/MonitorAnalyticsScreen';

const App: React.FC = () => {
   const { updateConfig } = useConfig(); // Get the updateConfig function from context

   useEffect(() => {
      // Update the configuration with values from the .env file
      const mapApiKey = process.env.REACT_APP_MAPTILER_API_KEY;
      if (mapApiKey) {
         updateConfig('MAPTILER_API_KEY', process.env.REACT_APP_MAPTILER_API_KEY);
      }
      document.title = 'insight';
   }, [updateConfig]);

   const [visibleWidgets, setVisibleWidgets] = useState({
      alerts: true,
      layers: true,
      legend: true,
   });

   const onWidgetToggle = (widget: "alerts" | "layers" | "legend", isVisible: boolean) => {
      setVisibleWidgets(prev => ({
         ...prev,
         [widget]: isVisible,
      }));
   };


   return (
      <Routes>
         <Route path="/" element={<MainLayout onWidgetToggle={onWidgetToggle} visibleWidgets={visibleWidgets}/>} >
            
            <Route path="visualization" element={<MonitorScreen onWidgetToggle={onWidgetToggle} visibleWidgets={visibleWidgets}/>} />
            <Route path="analytics" element={<MonitorAnalyticsScreen />} />    
            <Route path="about" element={<AboutScreen />} />
            <Route path="settings" element={<SettingScreen />} />
         </Route>
      </Routes>
   );
};

export default App;
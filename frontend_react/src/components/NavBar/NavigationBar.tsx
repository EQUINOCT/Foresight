import React, { useState } from "react";
import WidgetSelector from "./WidgetSelector";
import LocationSelector from "./LocationSelector";
import Person from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';

interface NavigationBarProps {
  activeControl: string;
  setActiveControl: (view:string) => void;
  setActiveView: (view:string) => void;
  menuItems: string[];
  activeView: string;
  onWidgetToggle: (widget: "alerts" | "layers" | "legend", isVisible: boolean) => void;
  visibleWidgets: { alerts: boolean; layers: boolean; legend: boolean };
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  activeControl,
  setActiveControl,
  setActiveView,
  menuItems,
  activeView,
  onWidgetToggle,
  visibleWidgets,
 }) => {
  //console.log(activeControl, activeView);
  //const [activeControl, setActiveControl] = useState('monitor');

  return (
    <header className="flex items-center justify-between bg-zinc-900 bg-opacity-90 bg-blend-overlay py-1.5 w-full ">

      {/* <nav className="flex justify-center">
        <ul className="flex gap-7 pl-[250px] items-center mt-2.5 list-none p-0 mb-2">
          {menuItems.map((item, index) => (  
            <li key={index} className="relative">
              <Link
               to={`/${item.toLowerCase()}-${'visualization'}`}
               className={` text-white no-underline font-inter bg-transparent w-full block text-center relative z-10 ${ activeControl.toLowerCase() === item.toLowerCase() ? "font-semibold text-[17px] text-teal-500" : "text-base"}`}
               onClick={()=> {
                // console.log(item);
                setActiveControl(item);
                setActiveView('visualization');
              }}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav> */}
      <div className="flex gap-2 pl-[15px] items-center justify-start">
        <div className="text-forest-100 text-[40px] font-sarabun"> 
          Foresight
        </div>
        <Typography sx={{ fontFamily: 'sarabun', color: '#fff', pt: '5px', opacity: '90%'}}> Vazhachal FDA</Typography>
      </div>

      <div className="flex gap-2 pr-[15px] items-center justify-end">
      <Paper
        component="form"
        sx={{ 
          p: '2px 1px', 
          display: 'flex', 
          alignItems: 'center', 
          width: 150, 
          bgcolor: '#18181b',
          borderRadius: '20px',
          border: '0.5px solid rgba(174, 214, 151, 0.5)'
        }}
      >
          <InputBase
            sx={{ ml: 1, flex: 1, color: '#fff', fontFamily: 'sarabun', pl:'10px', opacity: '50%' }}
            placeholder="Search.."
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton type="button" sx={{ p: '4.4px', pr: '10px', color: '#fff' }} aria-label="search">
            <SearchIcon />
          </IconButton>
      </Paper>
        {activeControl.toLowerCase() === "monitor" && activeView.toLowerCase() === "visualization" && (
            <WidgetSelector 
              onWidgetToggle={onWidgetToggle}
              visibleWidgets={visibleWidgets}
            />
        )}
        {/* <LocationSelector /> */}
        <IconButton
          aria-label={'user'}
          // size="large"
          sx={{
            width: '35px',
            height: '35px',
            backgroundColor: '#18181b',
            border: '0.5px solid rgba(174, 214, 151, 0.5)',
            color: '#AED697',
            borderRadius: '50%',
            padding: '10px',
          }}
        >
         <Notifications sx={{color: '#fff', height: '25px'}}/>
        </IconButton>
        <IconButton
          aria-label={'user'}
          // size="large"
          sx={{
            width: '35px',
            height: '35px',
            backgroundColor: '#18181b',
            border: '0.5px solid rgba(174, 214, 151, 0.5)',
            color: '#AED697',
            borderRadius: '50%',
            padding: '10px',
          }}
        >
         <Person sx={{color: '#fff'}}/>
        </IconButton>

      </div>
    </header>
  );
};

export default NavigationBar;

import React, { useState } from "react";
import WidgetSelector from "./WidgetSelector";
import LocationSelector from "./LocationSelector";
import Person from "@mui/icons-material/Person";
import { Link } from "react-router-dom";

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
    <header className="flex items-center justify-between bg-zinc-900 bg-opacity-95 py-2 w-full ">

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

      <div className="text-forest-100 text-[40px] pl-[10px] font-inter"> 
        Foresight
      </div>
          
      <div className="flex gap-2 pr-[10px] items-center justify-end">
        <div className="widget-selector-container" style={{ width: 100 }}>
          {activeControl.toLowerCase() === "monitor" && activeView.toLowerCase() === "visualization" && (
              <WidgetSelector 
                onWidgetToggle={onWidgetToggle}
                visibleWidgets={visibleWidgets}
              />
          )}
        </div>
        {/* <LocationSelector /> */}
        <div
          style={{
            width: '35px',
            height: '35px',
            backgroundColor: 'rgba(39, 39, 42, 1))',  // Black with 81% opacity
            borderRadius: '50%',
            backgroundImage: 'url("/broken-image.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Person sx={{color: '#fff'}}/>
        </div>

      </div>
    </header>
  );
};

export default NavigationBar;

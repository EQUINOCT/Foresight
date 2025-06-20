import React, { useState, useEffect, useRef } from 'react';
import Map from "@mui/icons-material/Map";
import Dashboard from "@mui/icons-material/Dashboard";
import About from "@mui/icons-material/Info";
// import Settings from "@mui/icons-material/Settings";
import { Link } from 'react-router-dom';
import {Flip, ToastContainer, toast} from 'react-toastify';

const icons = [
  { object: Map, string: "Map", view: "visualization"},
  { object: Dashboard, string: "Analytics", view: "analytics" },
  { object: About, string: "About", view: "about" },
  // { object: Settings, string: "Settings", view: "settings" },
];

interface MenuListProps {
  activeView: string;
  setActiveView: (view: string) => void;
}


const MenuList: React.FC<MenuListProps> = ({activeView, setActiveView}) => {

  const notify = () => {
      toast.success('Launching Soon', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });
  };

  return(
  <div className={`flex flex-col justify-center w-[88px] h-screen` }>
    <div className="flex flex-grow flex-col mb-[100px] ml-[15px] items-center justify-center w-full">
      <div className='flex items-center justify-center bg-zinc-900 bg-opacity-90 rounded-[100px] w-[70px]'>
        <ul className="flex flex-col items-center gap-6" style={{ listStyle: 'none',  padding: 0 }}>
          {icons.map((icon, index) => (
            <li key={index} className="relative">
            <Link
            to='#'
            // to={`/${icon.view}`}
            className="flex flex-col items-center gap-2 text-white bg-transparent"
            style={{ textDecoration: 'none' }}
            onClick={icon.view !== 'visualization' ? notify : undefined}
            >
              <div className="flex items-center justify-center bg-transparent gap-3 no-underline" > 
                <icon.object 
                className={`${icon.view === activeView? "bg-forest-100" : "bg-forest-300 text-forest-100"} px-2 py-2 rounded-full`}
                sx={{width: 25,height: 25}}
                />
              </div>
              <span className={` text-white font-sarabun bg-transparent ${ activeView.toLowerCase() === icon.string.toLowerCase() ? "font-semibold text-[14px]" : "text-xs"}`}>
                  {icon.string}
              </span> 
            </Link>
          </li>
          ))}
        </ul>
      </div>
    </div>
    <ToastContainer/>
  </div>
  );
};

export default MenuList;
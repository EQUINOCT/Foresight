import React, { useState } from "react";
// import Minimize from "@mui/icons-material/Minimize";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
// import Checkbox from "@mui/material/Checkbox";
// import Checkicon from "@mui/icons-material/CheckBox";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Draggable from "react-draggable";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import LocationCity from '@mui/icons-material/LocationCity';
import Bolt from '@mui/icons-material/Bolt';
import { GiElephant } from "react-icons/gi";
import { FaRoad } from "react-icons/fa";
import { Typography } from "@mui/material";
import { Water } from "@mui/icons-material";
import { Cloud } from "@mui/icons-material";
import { FaHouseChimneyUser } from "react-icons/fa6";


type GaugeType = "PRECIPITATION" | "RESERVOIR" | "TIDAL" | "GROUNDWATER" | "RIVER" | "REGULATOR";

interface LayersProps {
  visibleGauges: {
    PRECIPITATION: boolean;
    RESERVOIR: boolean;
    TIDAL: boolean;
    GROUNDWATER: boolean;
    RIVER: boolean;
    REGULATOR: boolean;
  };
  toggleGauge: (gauge: GaugeType) => void;
  onClose: () => void;
}

const LayersComponent: React.FC<LayersProps> = ({ visibleGauges, toggleGauge, onClose }) => {
  // const [activeTab, setActiveTab] = useState<"Manual" | "Real Time">("Manual");
  // const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label) // Remove if already selected
        : [...prev, label] // Add if not selected
    );
  };

  const icons = [
    { label: 'Conflicts', icon: <GiElephant /> },
    { label: 'Buildings', icon: <LocationCity /> },
    { label: 'Settlements', icon: <FaHouseChimneyUser /> },
    { label: 'Water bodies', icon: <Water /> },
    { label: 'Weather', icon: <Cloud /> },
    { label: 'Roads', icon: <FaRoad /> },
  ];
  
  return (
    <Draggable>
    <section className={`flex flex-col text-white font-sarabun rounded-3xl w-[90px] max-w-[90px] h-[415px] max-h-[415px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}>
      <div className={`flex flex-col pb-4 rounded-[18px] bg-opacity-90 bg-forest-400`}>
        {/* <header className={`flex flex-col pt-3.5 w-full ${isCollapsed ? "bg-transparent" : "rounded-[22px_22px_1px_1px] bg-zinc-800 bg-opacity-80 shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"}`}> */}
            <div className="pl-5 pt-5 pb-3 text-base leading-none">
              Layers
            </div>
            <Stack direction="column" spacing={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
              {icons.map(({ label, icon }) => (
                <React.Fragment key={label}>
                  <IconButton
                    aria-label={label.toLowerCase()}
                    size="large"
                    onClick={() => handleSelect(label)}
                    sx={{
                      backgroundColor: selected.includes(label) ? 'white' : '#AED697',
                      color: '#016D46',
                      '&:hover': {
                        backgroundColor: selected.includes(label) ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 100, 0, 0.8)',
                      },
                      borderRadius: '50%',
                      padding: '8px',
                    }}
                  >
                    {React.cloneElement(icon, { fontSize: 'inherit' })}
                  </IconButton>
                  <Typography sx={{ fontFamily: 'sarabun',fontSize: '12px', color: '#fff'}}>{label}</Typography>
                </React.Fragment>
              ))}
            </Stack>
          {/* {!isCollapsed && (
            <nav className="relative flex pl-4 mt-2 mb-1 text-xs leading-loose text-center justify-start">
              <button className={`font-inter bg-transparent ${activeTab === "Manual" ? "text-white" : "text-silver-100"}`}
                onClick={() => setActiveTab("Manual")}
              >
                Manual
              </button>
              <button className={`font-inter bg-transparent ${activeTab === "Real Time" ? "text-white" : "text-silver-100"}`}
                onClick={() => setActiveTab("Real Time")}
              >
                Real time
              </button>
              <div
                className={`absolute h-0.5 bg-stone-300 rounded-[100px_100px_0px_0px] transition-all duration-300 ease-in-out ${activeTab === "Manual" ? "left-[22px] w-[46px]" : "left-[79px] w-[60px]"}`}
                style={{ bottom: "-4px" }}
              />
            </nav>
          )} */}
        {/* </header> */}
        {/* {!isCollapsed && (
          <>
            <div className="flex flex-col px-5 gap-1 items-start mt-2 text-xs">
              <div className="flex items-center">
                <Checkbox
                 checked={visibleGauges.PRECIPITATION}
                 onChange={() => toggleGauge("PRECIPITATION")}
                 icon={<CheckBoxOutlineBlankIcon  sx={{ color: "#9f9c9c", width: 14, height: 14}}/>}
                 checkedIcon={<Checkicon sx={{color: "#9f9c9c", width: 14, height: 14}}/>}
                 sx={{
                  color: "#9f9c9c",
                  width: 14,
                  height: 14,
                  '&.Mui-checked': {
                    color: "#9f9c9c",
                  },
                 }}
                />
                <label>Rainfall gauges</label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  checked={visibleGauges.RESERVOIR}
                  onChange={() => toggleGauge("RESERVOIR")}
                  icon={<CheckBoxOutlineBlankIcon sx={{ color: "#9f9c9c",width: 14, height: 14 }} />}
                  checkedIcon={<Checkicon sx={{ color: "#9f9c9c", width: 14, height: 14 }} />}
                  sx={{
                    color: "#9f9c9c",
                    width: 14,
                    height: 14,
                    '&.Mui-checked': {
                      color: "#9f9c9c",
                    },
                  }}
                />
                <label>Reservoir/Dam level</label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  checked={visibleGauges.TIDAL}
                  onChange={() => toggleGauge("TIDAL")}
                  icon={<CheckBoxOutlineBlankIcon sx={{ color: "#9f9c9c", width: 14, height:14 }} />}
                  checkedIcon={<Checkicon sx={{ color: "#9f9c9c", width: 14, height: 14 }} />}
                  sx={{
                    color: "#9f9c9c",
                    width: 14,
                    height: 14,
                    '&.Mui-checked': {
                      color: "#9f9c9c",
                    },
                  }}
                />
                <label>Tidal level</label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  checked={visibleGauges.GROUNDWATER}
                  onChange={() => toggleGauge("GROUNDWATER")}
                  icon={<CheckBoxOutlineBlankIcon sx={{ color: "#9f9c9c", width: 14, height:14 }} />}
                  checkedIcon={<Checkicon sx={{ color: "#9f9c9c", width: 14, height:14  }} />}
                  sx={{
                    color: "#9f9c9c",
                    width: 14,
                    height: 14,
                    '&.Mui-checked': {
                      color: "#9f9c9c",
                    },
                  }}
                />
                <label>Groundwater level</label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  checked={visibleGauges.RIVER}
                  onChange={() => toggleGauge("RIVER")}
                  icon={<CheckBoxOutlineBlankIcon sx={{ color: "#9f9c9c", width: 14, height:14 }} />}
                  checkedIcon={<Checkicon sx={{ color: "#9f9c9c", width: 14, height:14  }} />}
                  sx={{
                    color: "#9f9c9c",
                    width: 14,
                    height: 14,
                    '&.Mui-checked': {
                      color: "#9f9c9c",
                    },
                  }}
                />
                <label>River water level</label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  checked={visibleGauges.REGULATOR}
                  onChange={() => toggleGauge("REGULATOR")}
                  icon={<CheckBoxOutlineBlankIcon sx={{ color: "#9f9c9c" , width: 14, height:14 }} />}
                  checkedIcon={<Checkicon sx={{ color: "#9f9c9c", width: 14, height:14  }} />}
                  sx={{
                    color: "#9f9c9c",
                    width: 14,
                    height: 14,
                    '&.Mui-checked': {
                      color: "#9f9c9c",
                    },
                  }}
                />
                <label>Regulators</label>
              </div>
            </div>
          </>
        )} */}
      </div>
    </section>
  </Draggable>
  );
};

export default LayersComponent;
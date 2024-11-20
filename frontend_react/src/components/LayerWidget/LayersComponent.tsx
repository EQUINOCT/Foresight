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
type label = "conflicts" | "buildings" | "settlements" | "water" | "roads" | "weather";
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
  forestLayers: {
    conflicts: boolean;
    buildings: boolean;
    settlements: boolean;
    water: boolean;
    roads: boolean;
    weather: boolean;
  }
  setForestLayers: React.Dispatch<React.SetStateAction<{
    conflicts: boolean;
    buildings: boolean;
    settlements: boolean;
    water: boolean;
    roads: boolean;
    weather: boolean;
  }>>;
}

const LayersComponent: React.FC<LayersProps> = ({ visibleGauges, toggleGauge, onClose, forestLayers, setForestLayers}) => {
  // const [activeTab, setActiveTab] = useState<"Manual" | "Real Time">("Manual");
  // const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // const handleSelect = (label: string) => {
  //   setForestLayers((prev) =>
  //     prev.includes(label)
  //       ? prev.filter((item) => item !== label) // Remove if already selected
  //       : [...prev, label] // Add if not selected
  //   );
  // };

  const handleSelect = (label: keyof typeof forestLayers) => {
  setForestLayers((prev) => ({
    ...prev,
    [label]: !prev[label], // Toggle the boolean value for the selected layer
  }));
  };

  const icons = [
    { label: 'Conflicts', icon: <GiElephant /> },
    { label: 'Buildings', icon: <LocationCity /> },
    { label: 'Settlements', icon: <FaHouseChimneyUser /> },
    { label: 'Waterbodies', icon: <Water /> },
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
                    onClick={() => handleSelect(label as keyof typeof forestLayers)} // Ensure label is a key of forestLayers
                    sx={{
                      backgroundColor: forestLayers[label as keyof typeof forestLayers] ? 'white' : '#AED697', // Check the boolean value
                      color: '#016D46',
                      '&:hover': {
                        backgroundColor: forestLayers[label as keyof typeof forestLayers] ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 100, 0, 0.8)',
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
      </div>
    </section>
  </Draggable>
  );
};

export default LayersComponent;
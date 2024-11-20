import React, {useState} from "react";
import AlertWidgetComponent from "../AlertWidget/AlertWidgetComponent";
import LayerComponent from "../LayerWidget/LayersComponent";
import Legend from "../LegendWidget/Legend";
import { MonitoringMapComponent } from "../Maps/MonitoringMapComponent";
import EQLogo from './Logo.png';

// type GaugeType = "PRECIPITATION" | "RESERVOIR" | "TIDAL" | "GROUNDWATER" | "RIVER" | "REGULATOR";

interface GaugeType {
  PRECIPITATION: boolean;
  RESERVOIR: boolean;
  TIDAL: boolean;
  GROUNDWATER: boolean;
  RIVER: boolean;
  REGULATOR: boolean;
}


const initialVisibleGauges = {
  PRECIPITATION: false,
  RESERVOIR: false,
  TIDAL: false,
  GROUNDWATER: false,
  RIVER: false,
  REGULATOR : false,
};

interface MonitorScreenProps {
  visibleWidgets: {alerts: boolean, layers: boolean, legend: boolean};
  onWidgetToggle: (widget: "alerts" | "layers" | "legend", isVisible: boolean) => void;
}

const MonitorScreen: React.FC<MonitorScreenProps> = ({onWidgetToggle, visibleWidgets}) => {
  // const [visibleWidgets, setVisibleWidgets] = useState({
  //   alerts: true,
  //   layers: true,
  //   legend: true,
  // });

  // const onWidgetToggle = (widget: "alerts" | "layers" | "legend", isVisible: boolean) => {
  //   setVisibleWidgets(prev => ({
  //     ...prev,
  //     [widget]: isVisible,
  //   }));
  // };
  const logoStyle = {
    width: '100px', // Set the width to 100px
    height: '100px', // Set the height to 100px
    objectFit: 'contain', // Maintain aspect ratio
   };

  const [visibleGauges, setVisibleGauges] = useState(initialVisibleGauges);

  // const [visibleAlerts, setVisibleAlerts] = useState(true);
  // const [visibleLayers, setVisibleLayers] = useState(true);
  // const [visibleLegend, setVisibleLegend] = useState(true);

  function toggleGauge(gaugeType: keyof GaugeType) {
    setVisibleGauges({ ...visibleGauges, [gaugeType]: !visibleGauges[gaugeType] });
  };

  const isGaugesVisible = Object.values(visibleGauges).some((isVisible) => isVisible);

  return (
    <div className="monitor-screen w-full h-full relative flex flex-col overflow-hidden">
      <div className="absolute w-full h-full overflow-hidden">
        <MonitoringMapComponent
        visibleGauges={visibleGauges} />
      </div>

      {/* Widgets */}
      <div className="absolute right-0 top-1/2 pb-5 transform -translate-y-1/2 mr-[20px] flex flex-col items-center">
        {visibleWidgets.layers && (
          <LayerComponent
            visibleGauges={visibleGauges}
            toggleGauge={toggleGauge}
            onClose={() => onWidgetToggle('layers', false)}
          />
        )}
        {isGaugesVisible && visibleWidgets.legend && (
          <div className="mt-[15px] right-0">
            <Legend
              visibleGauges={visibleGauges}
              isVisible={visibleWidgets.legend}
              toggleVisibility={() => onWidgetToggle('legend', !visibleWidgets.legend)}
            />
          </div>
        )}
      </div>
      <div className="absolute right-0 bottom-0 pr-[20px] pb-[5px]">
        <img src={EQLogo} alt="Logo" className="logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
      </div>
      {/* Alerts */}
      {/* <div style={{ position: "absolute", top: "30px", left: "20px" }}>
        {visibleWidgets.alerts && (
          <AlertWidgetComponent
            visibleAlerts={visibleWidgets.alerts}
            OnClose={() => onWidgetToggle('alerts', false)}
          />
        )}
      </div> */}
    </div>
  );
};

export default MonitorScreen;
import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles.css';
import { useConfig } from '../../ConfigContext';
// import configData from "../../config.json";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import {addPointSource, addPointLayer, addCustomMarkerForPointLayer, togglePointLayers, cursorToPointerOnHover,  handleClickOnLayer }  from '../Layers/PointLayer';
import { addBoundarySource, addBoundaryLayer, removeBoundaryLayer, getIntersectingPolygons } from '../Layers/PolygonLayer';
import { LogoControl, NavigationControl } from '@maptiler/sdk';
import { AddCircleOutlineSharp } from '@mui/icons-material';
import { generateCustomMarker, incrementState } from '../Layers/misc';

interface MonitoringMapComponentProps {
  visibleGauges: { PRECIPITATION: boolean; RESERVOIR: boolean; TIDAL: boolean; GROUNDWATER: boolean; RIVER: boolean; REGULATOR: boolean; };
  forestLayers: { conflicts: boolean, buildings: boolean, settlements: boolean, water: boolean, roads: boolean, weather: boolean};
}

// maptilersdk.config.apiKey = configData.MAP_TILER_API_KEY;
const MonitoringMapComponent: React.FC<MonitoringMapComponentProps> = React.memo(({visibleGauges, forestLayers}) => {
  const { config } = useConfig();
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  // const [layerVisible, setLayerVisible] = useState<boolean>(true);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mapState, setMapState] = useState({boundaryLevel: 0});
  const [pointLayerState, setPointLayerState] = useState({
    PRECIPITATION: null,
    RESERVOIR: null,
    RIVER: null
  });
  const [markerState, setMarkerState] = useState({
    PRECIPITATION: [],
    RESERVOIR: [],
    RIVER: []
  });
  const [currentFeatureLayerId, setCurrentFeatureLayerId] = useState<String | null>(null);
  // const map = useRef<HTMLDivElement | null>(null);
  const lng = config.MAP_CONFIG.LON;
  const lat = config.MAP_CONFIG.LAT;
  const zoom = config.MAP_CONFIG.ZOOM;
  const API_KEY = config.MAPTILER_API_KEY;
  const mapStyleUrl = config.MAPS.MONITORING + API_KEY;

  // if (map.current) return; // stops map from intializing more than once
  useEffect(() => { 
    if(mapContainer.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyleUrl,
        center: [lng, lat],
        zoom: zoom,
      });
      
      map.on('load', async function () {
        let layerId, targetLayerId;

        map.addSource('boundary-data', {type: 'geojson', data: config.LAYERS.BOUNDARY.URL});
        map.addLayer({
          id: 'division-area',
          type: 'fill',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'boundary-data',
          // layout: {
          //     'visibility': 'visible'
          // }
          paint: {
            'fill-color': '#80AE4B',
            'fill-opacity': 0.3
          }
        });
        map.addLayer({
          id: 'division-outline',
          type: 'line',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'boundary-data',
          // layout: {
          //     'visibility': 'visible'
          // }
          paint: {
            'line-width': 3,
            'line-color': '#80AE4B',
            'line-opacity': 0.5
          }
        }); 
        const image = await map.loadImage('assets/icons/conflict.png');
        map.addImage('cat', image.data);

        map.addSource('conflicts-data', {type: 'geojson', data: config.LAYERS.CONFLICTS.URL});
        map.addLayer({
          id: 'conflicts',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'conflicts-data',
          layout: {
              'icon-image': 'cat',
              'icon-size': 0.1,
              'visibility': 'none'
          },
          filter: ['==', '$type', 'Point']
        }); 
       
        map.addSource('water-data', {type: 'geojson', data: config.LAYERS.WATER.URL});
        map.addLayer({
          id: 'waterbody',
          type: 'fill',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'water-data',
          paint: {
              'fill-color': 'blue',
              // 'fill-opacity': 1
          },
          layout: {
              'visibility': 'none'
          },
          filter: ['==', '$type', 'Polygon']
        }); 
        map.addLayer({
          id: 'stream',
          type: 'line',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'water-data',
          paint: {
              'line-color': 'blue',
              // 'fill-opacity': 1
          },
          layout: {
              'visibility': 'none'
          },
          filter: ['==', '$type', 'LineString']
        }); 
        map.addLayer({
          id: 'waterfall',
          type: 'circle',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'water-data',
          // paint: {
          //     'line-color': 'blue',
          //     // 'fill-opacity': 1
          // },
          layout: {
              'visibility': 'none'
          },
          filter: ['==', '$type', 'Point']
        }); 

        map.addSource('building-data', {type: 'geojson', data: config.LAYERS.BUILDINGS.URL});
        map.addLayer({
          id: 'location',
          type: 'circle',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'building-data',
          layout: {
              'visibility': 'none'
          }
        }); 
        map.addSource('road-data', {type: 'geojson', data: config.LAYERS.ROADS.URL});
        map.addLayer({
          id: 'road',
          type: 'line',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'road-data',
          layout: {
              'visibility': 'none'
          }
        }); 
        
        setMap(map);
     

        return () => {
          map.remove();
        };
      });
    }
  }, []); 

  useEffect(() => {
    if (map) {
      // Iterate over the keys of the forestLayers object
      Object.keys(forestLayers).forEach((category) => {
        // Check if the layer exists in the map
        const visibility = forestLayers[category as keyof typeof forestLayers] ? 'visible' : 'none';
        const layerIds = config.LAYERS[category.toUpperCase()].ID;
        layerIds.forEach((layerId: string) => {
          if (map.getLayer(layerId)) {
            // If the layer is selected (true), set it to visible
            map.setLayoutProperty(layerId, 'visibility', visibility);
          }
        });
      });
    }
  }, [forestLayers, map]); // Ensure map is also included in the dependency array


  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
    </div>
  )
});

export { MonitoringMapComponent };
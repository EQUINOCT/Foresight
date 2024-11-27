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
  forestLayers: { conflicts: boolean, buildings: boolean, settlements: boolean, waterbodies: boolean, roads: boolean, weather: boolean};
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

  const bounds : maptilersdk.LngLatBoundsLike = [
    76.15, 10.05, 
    76.95, 10.481];

  // if (map.current) return; // stops map from intializing more than once
  useEffect(() => { 
    if(mapContainer.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyleUrl,
        center: [lng, lat],
        zoom: zoom,
        minZoom: zoom
      });

      map.fitBounds(bounds, {
        padding: { top: 10, bottom: 10, left: 10, right: 10 }, // Optional padding

      // Optional: Prevent zooming out beyond the minimum zoom level
      });

      // Set the max bounds to restrict panning
      map.setMaxBounds(bounds);



      map.on('zoomend', () => {
        if (map.getZoom() < map.getMinZoom()) {
          map.setZoom(map.getMinZoom());
        }
      });

      // Optional: Prevent panning outside the bounds
      map.on('moveend', () => {
        const currentCenter = map.getCenter();
        const sw = [bounds[0], bounds[1]]; // Southwest coordinates
        const ne = [bounds[2], bounds[3]]; // Northeast coordinates
        // Check if the current center is outside the bounds
        if (
          currentCenter.lng < sw[0] || currentCenter.lng > ne[0] ||
          currentCenter.lat < sw[1] || currentCenter.lat > ne[1]
        ) {
          // Reset to the closest point within bounds
          const clampedLng = Math.max(sw[0], Math.min(currentCenter.lng, ne[0]));
          const clampedLat = Math.max(sw[1], Math.min(currentCenter.lat, ne[1]));
          map.setCenter([clampedLng, clampedLat]);
        }
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
            'fill-color': '#dcd9d1',
            'fill-opacity': 0.4
          },
          filter: ['==', 'DIVISION', 'Vazhachal']
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
            'line-color': '#dcd9d1',
            'line-opacity': 0.5
          },
          filter: ['==', 'DIVISION', 'Vazhachal']
        }); 
        map.addLayer({
          id: 'range-area',
          type: 'fill',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'boundary-data',
          // layout: {
          //     'visibility': 'visible'
          // }
          paint: {
            'fill-color': '#80AE4B',
            'fill-opacity': 0.2
          },
          filter: ['!=', 'DIVISION', 'Vazhachal']
        });
        map.addLayer({
          id: 'range-outline',
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
          },
          filter: ['!=', 'DIVISION', 'Vazhachal']
        }); 
        const image = await map.loadImage('assets/icons/conflict.png');
        map.addImage('conflict', image.data);

        map.addSource('conflicts-data', {type: 'geojson', data: config.LAYERS.CONFLICTS.URL, tolerance: 0});
        map.addLayer({
          id: 'conflicts',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'conflicts-data',
          layout: {
              'icon-image': 'conflict',
              'icon-size': 0.05,
              'visibility': 'none'
          },
          filter: ['==', '$type', 'Point']
        }); 

        const waterfallImg = await map.loadImage('assets/icons/waterfall.png');
        map.addImage('waterfall-img', waterfallImg.data);
        const pondImg = await map.loadImage('assets/icons/pond.png');
        map.addImage('pond-img', pondImg.data);
       
        map.addSource('water-data', {type: 'geojson', data: config.LAYERS.WATERBODIES.URL});
        map.addLayer({
          id: 'waterbody',
          type: 'fill',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'water-data',
          paint: {
              'fill-color': '#85CBFA',
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
              'line-color': '#85CBFA',
              // 'fill-opacity': 1
          },
          layout: {
              'visibility': 'none'
          },
          filter: ['==', '$type', 'LineString']
        }); 


        map.addLayer({
          id: 'waterfall',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'water-data',
          layout: {
              'icon-image': 'waterfall-img',
              'icon-size': 0.07,
              'visibility': 'none'
          },
          filter: ['==', 'category', 'waterfall']
        }); 
        map.addLayer({
          id: 'pond',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'water-data',
          layout: {
              'icon-image': 'pond-img',
              'icon-size': 0.07,
              'visibility': 'none'
          },
          filter: ['==', 'category', 'pond']
        }); 
        
        const hoImg = await map.loadImage('assets/icons/hq.png');
        map.addImage('ho-img', hoImg.data);
        const officeImg = await map.loadImage('assets/icons/office.png');
        map.addImage('office-img', officeImg.data);
        const campImg = await map.loadImage('assets/icons/camp.png');
        map.addImage('camp-img', campImg.data)

        map.addSource('building-data', {type: 'geojson', data: config.LAYERS.BUILDINGS.URL});
        map.addLayer({
          id: 'ho',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'building-data',
          layout: {
              'icon-image': 'ho-img',
              'icon-size': 0.1,
              'visibility': 'none'
          },
          filter: ['==', 'Category', 'HO']
        }); 
        map.addLayer({
          id: 'hq',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'building-data',
          layout: {
              'icon-image': 'office-img',
              'icon-size': 0.07,
              'visibility': 'none'
          },
          filter: ['==', 'Category', 'HQ']
        }); 
        map.addLayer({
          id: 'campshed',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'building-data',
          layout: {
              'icon-image': 'camp-img',
              'icon-size': 0.07,
              'visibility': 'none'
          },
          filter: ['==', 'Category', 'Campshed']
        }); 

        const settlementImg = await map.loadImage('assets/icons/settlement.png');
        map.addImage('settlement-img', settlementImg.data);
        map.addSource('tribal-data', {type: 'geojson', data: config.LAYERS.SETTLEMENTS.URL});
        map.addLayer({
          id: 'settlements',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'tribal-data',
          layout: {
              'icon-image': 'settlement-img',
              'icon-size': 0.07,
              'visibility': 'none'
          },
        }); 

        // map.setFilter('hq', ['==', 'category', 'HQ']);
        map.addSource('road-data', {type: 'geojson', data: config.LAYERS.ROADS.URL});
        map.addLayer({
          id: 'road',
          type: 'line',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'road-data',
          paint: {
            'line-width': 4,
          },
          layout: {
              'visibility': 'none'
          },
          filter: ['==', '$type', 'LineString']
        });
        const checkpostImg = await map.loadImage('assets/icons/checkpost.png');
        map.addImage('checkpost-img', checkpostImg.data);
        map.addLayer({
          id: 'checkpost',
          type: 'symbol',
          // If source is a full layer, it will have Source ID, 
          // else if generated, data passed directly.
          source: 'road-data',
          layout: {
              'icon-image': 'checkpost-img',
              'icon-size': 0.07,
              'visibility': 'none'
          },
          filter: ['==', '$type', 'Point']
        }); 
        
        setMap(map);
     

        return () => {
          map.remove();
        };
      });


      // map.on('mouseenter', 'boundary', (e) => {
      //     // Change the cursor style as a UI indicator.
               
      //     const popup = new maplibregl.Popup({
      //         closeButton: false,
      //         closeOnClick: false
      //     });
      //     if (e.features && e.features.length > 0) {

      //       map.getCanvas().style.cursor = 'pointer'; 

      //       const feature = e.features[0];
      //       if (feature.geometry.type === 'Polygon') {
      //       // Get the coordinates of the polygon's centroid or a point within the polygon
      //       const coordinates = feature.geometry.coordinates[0]; // Assuming the first ring is the outer ring
      //       const description = 'text';


      //       // Calculate the centroid of the polygon to position the popup
      //       const centroid = coordinates.reduce((acc, coord) => {
      //           acc[0] += coord[0];
      //           acc[1] += coord[1];
      //           return acc;
      //       }, [0, 0]).map(coord => coord / coordinates.length);

      //       // Ensure that if the map is zoomed out such that multiple
      //       // copies of the feature are visible, the popup appears
      //       // over the copy being pointed to.
      //       while (Math.abs(e.lngLat.lng - centroid[0]) > 180) {
      //           centroid[0] += e.lngLat.lng > centroid[0] ? 360 : -360;
      //       }

      //       // Populate the popup and set its coordinates based on the centroid
      //       popup.setLngLat(centroid).setHTML(description).addTo(map);
      //     }
      //   }
      // });

      // map.on('mouseleave', 'polygons', () => {
      //     map.getCanvas().style.cursor = '';
      //     popup.remove();
      // });


      map.on('click', (e) => {

        const feature = map.queryRenderedFeatures(e.point, {
          layers: ['settlements', 'ho', 'hq', 'campshed', 'conflicts', "waterbody", "stream", "waterfall", "pond", "checkpost", 'road']
        })[0];
        if (feature.geometry.type === 'Point') {
          console.log(feature);
          var popupText;
          if (feature.layer.id === 'settlements') {
            popupText = `<h3>${feature.properties.NAME}</h3>
                         <h4>${feature.properties.no_of_fami} families</h4>`
          } else if (feature.layer.id === 'ho') {
            popupText = `<h3>Chalakudy Divisional Head Office</h3>`
          } else if (feature.layer.id === 'hq') {
            popupText = `<h3>${feature.properties.NAME}</h3>
                         <h4>under ${feature.properties.HQ}</h4>`
          } else if (feature.layer.id === 'campshed') {
            popupText = `<h3>${feature.properties.Station}</h3>
                         <h4>Place: ${feature.properties.Name}</h4>
                         <h4>Circle: ${feature.properties.Circle}</h4>`
          } else if (feature.layer.id === 'checkpost') {
            popupText = `<h3>${feature.properties.Name}</h3>`

          } else {
            popupText = '<h4>No data</h4>'
          }
          console.log(popupText);
          const coordinates = feature.geometry.coordinates as maptilersdk.LngLatLike;
          let popup = new maptilersdk.Popup().setLngLat(coordinates).setHTML(popupText).addTo(map);
        } 
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
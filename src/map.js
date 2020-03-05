import React, {Component} from 'react';
import MapGL, { Marker, Popup } from 'react-map-gl';
import {json as requestJson} from 'd3-request';
import Info from './infoPanel';
import viewChange from './redux/actions';
import { connect } from 'react-redux';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibmF0aGFuc21pdGgzMzgwIiwiYSI6ImNqeXJuYXh0NjBiZnQzYm4yYmJsemFzaXMifQ.1czy14iqghXYnWfJ7vLRcA'; // Set your mapbox token here

class Map extends Component {
  mapRef = null;

  state = {
    data: {
      features: []
    },
    viewport: {
      latitude: -28,
      longitude: 153,
      zoom: 9,
      bearing: 0,
      pitch: 0
    },
    popupInfo: null,
    status: '',
    type: '',
    area: 0,
    material: ''
  };

  componentDidMount() {
    requestJson(
      'boat_ramps.geojson',
      (error, response) => {
        if (!error) {
          this._loadData(response);
        }
      }
    );
  }
  
  inBounds = (point, bounds) => {
    var lng = (point.geometry.coordinates[0][0][0][0] - bounds._ne.lng) * (point.geometry.coordinates[0][0][0][0] - bounds._sw.lng) < 0;
    var lat = (point.geometry.coordinates[0][0][0][1] - bounds._ne.lat) * (point.geometry.coordinates[0][0][0][1] - bounds._sw.lat) < 0;
    return lng && lat;
  }

  _loadData = data => {
    const points = data.features.map(point => point);

    this.setState({data});
    this.props.viewChange(points);
  };


  _onViewportChange = viewport => {
    this.setState({viewport});
    let points = [];
    const { data } = this.state;

    if (!this.mapRef) return;
    
    const bounds = this.mapRef.getMap().getBounds()
  
    data.features.map(point =>{
      if(this.inBounds(point,bounds)) {
        points.push(point);
      }
    })

    this.props.viewChange(points);
  }

  onClickPoint = point => {
    const popupInfo = {
      longitude: point.geometry.coordinates[0][0][0][0],
      latitude: point.geometry.coordinates[0][0][0][1]
    };

    this.setState({
      popupInfo, 
      status: point.properties.status,
      type: point.properties.type,
      area: point.properties.area_,
      material: point.properties.material
    });
  }

  render() {
    const {viewport, data, popupInfo, status,type,area,material} = this.state;
  
    return (
      <div style={{height: '100%'}}>
        <MapGL
          ref={ref => this.mapRef = ref}
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/light-v9"
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
    
        >
          {data.features.map((point, index) => {
            return (
              <div key={index} onClick={() => this.onClickPoint(point)}>
                <Marker 
                  longitude={point.geometry.coordinates[0][0][0][0]} 
                  latitude={point.geometry.coordinates[0][0][0][1]} >
                    <img className="marker" src="pin.png" />
                </Marker>
              </div>
            )}  
          )} 
          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              closeOnClick={false}
              onClose={() => this.setState({popupInfo: null})}
            >
         
                <h3>Info</h3>
                <p>Status: {status}</p>
                <p>material: {material}</p>
                <p>type:  {type}</p>
                <p>area: {area}</p>

            </Popup>
          )}
          
        </MapGL>
        <Info/>
      </div>
    );
  }
}

export default connect(null, { viewChange })(Map);

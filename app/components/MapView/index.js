import React from 'react';
import { default as ScriptjsLoader } from 'react-google-maps/lib/async/ScriptjsLoader';
import GoogleMap from 'react-google-maps/lib/GoogleMap';
import Marker from 'react-google-maps/lib/Marker';
import { triggerEvent } from 'react-google-maps/lib/utils';
import Button from 'components/Button';
import styles from './styles.css';
import shallowCompare from 'react-addons-shallow-compare';


export default class MapView extends React.Component {
  constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.listener = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    google.maps.event.removeListener(this.listener); // eslint-disable-line
  }

  handleButtonClick() {
    this.props.onClick();
    this.listener = google.maps.event.addListener(this.googleMapComponent.props.map, 'idle', () => { // eslint-disable-line
        google.maps.event.trigger(this.googleMapComponent.props.map, 'resize'); // eslint-disable-line
    });
  }

  handleResize() {
    triggerEvent(this.googleMapComponent, 'resize');
  }


  render() {
    return (
      <div className={styles.mapViewContainer} id="mapContainer">
        <Button
          onClick={this.handleButtonClick}
          type="locationToggle"
        >
          Set Location
        </Button>
        <ScriptjsLoader
          hostname={"maps.googleapis.com"}
          pathname={"/maps/api/js"}
          query={{ v: '3', libraries: 'geometry,drawing,places', key: 'AIzaSyBdMrXj-0n962gbf0PNSkP9r49soZamXgQ' }}
          loadingElement={<div>hello</div>}
          containerElement={
            <div style={{ height: '100%', width: '100%' }} />
            }
          googleMapElement={
            <GoogleMap
              ref={googleMap => {
                if (!googleMap) {
                  return;
                }
                this.googleMapComponent = googleMap;
              }}
              defaultOptions={{ mapTypeControl: false, streetViewControl: false }}
              defaultZoom={6}
              defaultCenter={this.props.markerLocation.lat ? this.props.markerLocation : { lat: 43.6532, lng: -79.3832 }}
              onClick={(data) => {
                if (this.props.open) this.props.onSelectMarker(data.latLng.lat(), data.latLng.lng());
              }}
            >
              {this.props.markerLocation.lat && this.props.markerLocation.lng ? <Marker position={this.props.markerLocation} /> : null}
            </GoogleMap>
            }
        />
      </div>
  );
  }
}

MapView.propTypes = {
  onSelectMarker: React.PropTypes.func,
  onClick: React.PropTypes.func,
  markerLocation: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
};

import React from 'react';
import { default as ScriptjsLoader } from 'react-google-maps/lib/async/ScriptjsLoader';
import GoogleMap from 'react-google-maps/lib/GoogleMap';
// import styles from './styles.css';

export default class MapView extends React.Component {
  renderMapView() {
    return (
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
            }}
            defaultOptions={{ mapTypeControl: false, streetViewControl: false }}
            defaultZoom={3}
            defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
          >
          </GoogleMap>
        }
      />
  );
  }

  render() {
    return this.renderMapView();
  }

}

MapView.propTypes = {
  lat: React.PropTypes.number.isRequired,
  lng: React.PropTypes.number.isRequired,
  onClick: React.PropTypes.func,
};

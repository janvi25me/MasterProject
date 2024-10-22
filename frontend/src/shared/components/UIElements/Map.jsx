import GoogleMapReact from 'google-map-react';

const Marker = ({ text }) => <div>{text}</div>;

const Map = () => {
  const defaultProps = {
    center: {
      lat: 40.712776,
      lng: -74.005974
    },
    zoom: 11
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{key: ""}}  
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals

      >
        <Marker
          lat={40.712776}
          lng={-74.005974}
          text="New York"
        />
      </GoogleMapReact>
    </div>
  );
};

export default Map;

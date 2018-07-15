import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const velibAPI = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel';
var queryUrl;
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      markers: [],
      startingPoint: [],
      endingPoint: [],
      hits: [],
      queryUrl: velibAPI,
    }

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    // fetch(velibAPI)
    //   .then(response => response.json())
    //   .then(data => this.setState({ hits: data.records }))
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.checkStations(latLng))
      .catch(error => console.error('Error', error));
  };

  checkStations = (latLng) => {
    fetch(velibAPI + '&geofilter.distance=' + latLng.lat + '%2C' + latLng.lng + '%2C' + 500 )
      .then(response => response.json())
      .then(data => {
        console.log(velibAPI + '&geofilter.distance=' + latLng.lat + '%2C' + latLng.lng + '%2C' + 500 )
        this.setState({ hits: data.records })
      })
  }

   render() {
     const { hits } = this.state;
     const GoogleMapContainer = withGoogleMap(props => (
        <GoogleMap
          defaultCenter = { { lat: 48.864716, lng: 2.349014 } }
          defaultZoom = { 12 }
        >
          { this.state.hits.map((hit, i) =>{
              return(
                <Marker
                  key={i}
                  position={{ lat: hit.fields.lat, lng: hit.fields.lon }}
                />
              )
            })}
        </GoogleMap>
     ));
     return(
        <div className="mapWrapper">
          <GoogleMapContainer
            containerElement={ <div style={{ height: `500px`, width: '500px' }} /> }
            mapElement={ <div style={{ height: `100%` }} /> }
          />
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Starting Point',
                    className: 'location-search-input',
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
     );
   }
};
export default Map;

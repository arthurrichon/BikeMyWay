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
      addressStart: '',
      addressEnd: '',
      markers: [],
      hitsStart: [],
      hitsEnd: [],
      queryUrl: velibAPI,
    }

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSelect = this.handleSelect.bind(this);
  }

  handleChangeStart = addressStart => {
    this.setState({ addressStart });
  };

  handleChangeEnd = addressEnd => {
    this.setState({ addressEnd });
  };

  handleSelectStart = addressStart => {
    geocodeByAddress(addressStart)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.checkStationsStart(latLng))
      .catch(error => console.error('Error', error));
  };

  handleSelectEnd = addressEnd => {
    geocodeByAddress(addressEnd)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.checkStationsEnd(latLng))
      .catch(error => console.error('Error', error));
  };

  checkStationsStart = (latLng) => {
    fetch(velibAPI + '&exclude.capacity=0&geofilter.distance=' + latLng.lat + '%2C' + latLng.lng + '%2C' + 500 )
      .then(response => response.json())
      .then(data => {
        console.log(velibAPI + '&geofilter.distance=' + latLng.lat + '%2C' + latLng.lng + '%2C' + 500 )
        this.setState({ hitsStart: data.records })
      })
  }

  checkStationsEnd = (latLng) => {
    fetch(velibAPI + '&exclude.capacity=0&geofilter.distance=' + latLng.lat + '%2C' + latLng.lng + '%2C' + 500 )
      .then(response => response.json())
      .then(data => {
        console.log(velibAPI + '&geofilter.distance=' + latLng.lat + '%2C' + latLng.lng + '%2C' + 500 )
        this.setState({ hitsEnd: data.records })
      })
  }

   render() {
     const { hits } = this.state;
     const GoogleMapContainer = withGoogleMap(props => (
        <GoogleMap
          defaultCenter = { { lat: 48.864716, lng: 2.349014 } }
          defaultZoom = { 12 }
        >
          { this.state.hitsStart.map((hit, i) =>{
              return(
                <Marker
                  key={i}
                  position={{ lat: hit.fields.lat, lng: hit.fields.lon }}
                />
              )
            })}
            { this.state.hitsEnd.map((hit, i) =>{
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
            value={this.state.addressStart}
            onChange={this.handleChangeStart}
            onSelect={this.handleSelectStart}
            shouldFetchSuggestions={true}
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
                      ? { backgroundColor: '#fafafa', cursor: 'pointer', fontSize: '11px', padding: '5px', maxWidth: '200px' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '11px', padding: '5px', maxWidth: '200px' };
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

          <PlacesAutocomplete
            value={this.state.addressEnd}
            onChange={this.handleChangeEnd}
            onSelect={this.handleSelectEnd}
            shouldFetchSuggestions={true}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Ending Point',
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
                      ? { backgroundColor: '#fafafa', cursor: 'pointer', fontSize: '11px', padding: '5px', maxWidth: '200px' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '11px', padding: '5px', maxWidth: '200px' };
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

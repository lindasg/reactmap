import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import ListView from './ListView';
import spinner from './images/circles-loader.svg';
import foursquare from './images/foursquare.png';

class App extends Component {

  state = {
    listOpen: true,
    map: {},
    infowindow: {},
    bounds: {},
    mapReady: false,
    // for future use when add location search
    mapCenter : { lat: 1.2833754, lng: 103.8585377 },
    mapError: false,
    width: window.innerWidth
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
  }

  componentWillReceiveProps({isScriptLoadSucceed}){

    // Check if script is loaded and if map is defined
    if (isScriptLoadSucceed && !this.state.mapReady ) {

      // create map
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: this.state.mapCenter,
  //      styles: mapStyles
      });

      // set up bounds and infowindow to use later
      const bounds = new window.google.maps.LatLngBounds();
      const infowindow = new window.google.maps.InfoWindow({maxWidth: 300});

      this.setState({
        map: map,
        infowindow: infowindow,
        bounds: bounds,
        mapReady: true,
      });

    // alert user if map request fails
    } else if ( !this.state.mapReady ) {
      console.log("Map did not load");
      this.setState({mapError: true});
    }
  }

  toggleList = () => {

    const { width, listOpen, infowindow } = this.state;

    if (width < 600) {
      // close infowindow if listview is opening
      if (!listOpen) {
        infowindow.close();
      }
      this.setState( { listOpen: !listOpen});
    }
  }

  updateWidth = () => {
    const { map, bounds } = this.state;
    this.setState( { width: window.innerWidth });
    if (map && bounds) {
      map.fitBounds(bounds)
    }
  }

  render() {

    const { listOpen, map, infowindow, bounds, mapReady, mapCenter, mapError } = this.state;

    return (
      <div className="container" role="main">
        <nav id="list-toggle" className="toggle" onClick={this.toggleList}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"></path>
          </svg>
        </nav>
        <section
          id="restaurant-list"
          className={ listOpen ? "list open" : "list"}
          role="complementary"
          tabIndex={ listOpen ? '0' : '-1' }
          >
          <h1 className="app-title">Singapore Museum</h1>
          <hr />
          { /* render markers only when map has loaded */
            mapReady ?
            <ListView
              map={map}
              infowindow={infowindow}
              bounds={bounds}
              mapCenter={mapCenter}
              toggleList={this.toggleList}
              listOpen={listOpen}
            />
            : <p>We are experiencing loading issues. Please check your internet connection</p>
          }
          <img src={foursquare} alt="Powered by Foursquare" className="fs-logo"/>
        </section>
        <section id="map" className="map" role="application">
          { mapError ?
            <div id="map-error" className="error" role="alert">
              Google Maps did not load.  Please try again later...
            </div>
            : <div className="loading-map">
                <h4 className="loading-message">Map is loading...</h4>
                <img src={spinner} className="spinner" alt="loading indicator" />
             </div>
        }
        </section>
      </div>
    );
  }
}

export default scriptLoader(
    ['https://maps.googleapis.com/maps/api/js?key=AIzaSyDRkF0DkyE2m_D5PaqeWtvkcDyaAlJI8eE&libraries=places']
)(App);

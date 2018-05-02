import React, { Component } from 'react';
import Place from './Place';
import noImage from './images/no-image-available.png';
import museumIcon from './images/museum-marker.png';
import spinner from './images/circles-loader.svg';
import PropTypes from 'prop-types';

class ListView extends Component {

  static propTypes = {
    map: PropTypes.object.isRequired,
    infowindow: PropTypes.object.isRequired,
    bounds: PropTypes.object.isRequired,
    mapCenter: PropTypes.object.isRequired,
    toggleList: PropTypes.func.isRequired,
    listOpen: PropTypes.bool.isRequired
  }

  state = {
    query: '',
    allPlaces: [],
    filteredPlaces: null,
    apiReturned: false
  }

  componentDidMount () {
     const service = new window.google.maps.places.PlacesService(this.props.map);
     const request = {
       location: this.props.mapCenter,
       radius: '1000',
       type: ['museum']
     }

     service.nearbySearch(request, (results, status) => {
       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
         this.setState({
           allPlaces: results,
           filteredPlaces: results,
           apiReturned: true
         });
         if(results) this.addMarkers(this.state.allPlaces);

       } else {
         this.setState({
           allPlaces: [],
           filterPlaces: [],
           apiReturned: true
         });
       }

     })

  }

  addMarkers = (places) => {

    const { map, bounds, infowindow, toggleList } = this.props;
    const self = this;

    places.forEach( (place, index) =>  {

      const position = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }

      place.marker = new window.google.maps.Marker({
        position,
        map,
        title: place.name,
        id: place.place_id,
        icon: museumIcon
      });

      bounds.extend(position);

      const service = new window.google.maps.places.PlacesService(map);
      service.getDetails({placeId: place.place_id}, function(pl, status) {

        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          place.marker.addListener('click', function() {
            const marker = this;
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(function() {
              marker.setAnimation(null);
            }, 2100);

            marker.infoContent = `<div class="place">
                                    <img class="place-photo" src="${pl.icon}" alt="${pl.name}">
                                    <div class="place-meta">
                                      <h2 class="place-title">${pl.name}</h2>
                                      <p class="place-data">${pl.types[0]}</p>
                                      <p class="place-contact">${pl.formatted_address}</p>
                                      <a class="place-phone" href="${pl.international_phone_number}">Tel: ${pl.international_phone_number}</a>
                                    </div>
                                  </div>
                                  <a class="place-link" href="${pl.website}" target="_blank">
                                    <span>Read more</span>
                                  </a>`
            infowindow.setContent(marker.infoContent);
            infowindow.open(map, marker);

          })

        }
      })

    });

    // size and center map
    map.fitBounds(bounds);
  }


  filterPlaces = (event) => {

    const { allPlaces } = this.state;
    const { infowindow } = this.props;
    const query = event.target.value.toLowerCase();

    // update state so input box shows current query value
    this.setState({ query: query })

    // close infoWindow when filter runs
    infowindow.close();

    // filter list markers by name of location
    const filteredPlaces = allPlaces.filter((place) => {
      const match = place.name.toLowerCase().indexOf(query) > -1;
      place.marker.setVisible(match);
      return match;
    })

    // sort array before updating state
    filteredPlaces.sort(this.sortName);

    this.setState({filteredPlaces: filteredPlaces })
  }

  showInfo = (place) => {
    // force marker click
    window.google.maps.event.trigger(place.marker,'click');
  }

  render() {

    const { apiReturned, filteredPlaces, query } = this.state;
    const { listOpen } = this.props;
    // API request fails
    if(apiReturned && !filteredPlaces) {
      return <div> API request failed. Please try again later.</div>

   // API request returns successfully
    } else if( apiReturned && filteredPlaces ){
      return (
        <div className="list-view">
          <input type="text"
            placeholder="filter by name"
            value={ query }
            onChange={ this.filterPlaces }
            className="query"
            role="search"
            aria-labelledby="text filter"
            tabIndex={ listOpen ? '0' : '-1' }
          />
          { apiReturned && filteredPlaces.length > 0 ?
          <ul className="places-list">
            {filteredPlaces.map((place, id) =>
              <Place
                key={place.id}
                place={place}
                listOpen={listOpen}
              />
            )}
          </ul>
          : <p id="filter-error" className="empty-input">No places match filter</p>
          }
        </div>
      );

    // API request has not returned yet
    } else {
      return (
        <div className="loading-fs">
          <h4 className="loading-message">Loading Restaurants...</h4>
          <img src={spinner} className="spinner" alt="loading indicator" />
       </div>
     )
    }

  }
}

export default ListView;

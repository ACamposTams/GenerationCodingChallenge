import React, { Component } from 'react';
//Add the google-maps-react components for map markers and the API wraper
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react'
//Load the stores information from the json file
import data from 'json!../store_directory.json';
//Load the geocode component from react-geocode to find the stores and mark them in the map
import Geocode from 'react-geocode';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class YourComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      markers: [],
      favorites: []
    }
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  //Add markers to map
  componentDidMount() {
    this.getMarkersPositionFromData()
  }

  //Add new marker to array of markers
  addMarkerToMarkers(lat,lng,name,address) {
    var marker = <Marker onClick={this.onMarkerClick}
              position = {{lat: lat, lng: lng}}
              title = {address}
              name = { name }
              icon = {{url: 'https://www.google.com/mapfiles/marker.png'}}
            />
    this.setState({ markers: this.state.markers.concat([marker]) })
  }

  //Get the coordinates of the stores data and generate marker's array
  getMarkersPositionFromData() {
    for (let i = 0; i < data.length; i++) {
      Geocode.fromAddress(data[i].Address).then(
        res => {
          const {lat, lng} = res.results[0].geometry.location
          this.addMarkerToMarkers(lat,lng,data[i].Name,data[i].Address)
        }
      )
    }
  }

  //Trigger for Marker Clicks, save marker to favorites or remove from favorites if found
  onMarkerClick(props, marker, e) {
    if (this.state.favorites.includes(marker)) {
      this.setState({ favorites: this.state.favorites.filter(favorite => favorite != marker)})
      marker.setIcon('https://www.google.com/mapfiles/marker.png')
    } else {
      this.setState({ favorites: this.state.favorites.concat([marker]) })
      marker.setIcon('https://www.google.com/mapfiles/marker_green.png')
    }
  }

  //Display list of favorites
  showfavorites() {
    if (this.state.favorites.length > 0) {
      var favs = []
      for (let i=0; i < this.state.favorites.length; i++) {
        favs.push(<div> <p style={favoriteNameStyle}> {this.state.favorites[i].name} </p> <p style={favoriteAddressStyle}> {this.state.favorites[i].title} </p> </div>)
      }
      return favs
    }
  }

  render() {
    return (
      <div style={divStyle}>
        <div style={mapWrapper}>
          <Map
            style={mapStyle}
            google = {this.props.google}
            zoom = { 10 }
            initialCenter = {{ lat: 19.4326, lng: -99.1332}}
          >
          {this.state.markers}
          </Map>
        </div>
        <div style={favoriteStyle}>
          <h1 style={{textAlign: 'center'}}> My Favorite Stores </h1>
          <h6 style={{textAlign: 'center'}}> (Click in a marker to add to the list, click again to remove) </h6>
		      {this.showfavorites()}
        </div>
      </div>
    )
  }
}

//Wrapper for Google Maps API
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCVH8e45o3d-5qmykzdhGKd1-3xYua5D2A')
})(YourComponent)


var divStyle = {
  border: 'red',
  borderWidth: 2,
  borderStyle: 'solid',
  padding: 20,
  height: '500px',
  display: 'flex'
};

//style of map container
var mapWrapper = {
  width: '70%', 
  position: 'relative'
}

//style of map
var mapStyle = {
  width: '100%', 
  height: '100%', 
  position: 'relative'
}

//style of favorites list
var favoriteStyle = {
  width: '30%',
  float: 'right',
  paddingLeft: 10,
  overflowY: 'scroll',
  fontFamily: 'Verdana'
}

//style of the favorites names
var favoriteNameStyle = {
  fontSize: '16px',
  bold: 'true',
  fontFamily: 'Verdana',
  fontWeight: 'bold'
}

//style of the favorites addresses
var favoriteAddressStyle = {
  fontSize: '12px',
  fontFamily: 'Verdana',
  borderBottom: '2px solid grey'
}
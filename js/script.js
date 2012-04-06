/* Author:

*/

var map, data,
    term = 'bar';

$(function() {
  $.getJSON('http://api.yelp.com/business_review_search?term='+term+'&lat=38.9&long=-77.035&radius=10&limit=10&ywsid=WRKYQtsZN-0vUyGouB9GlQ&callback=?', function(d) {
    createMap('http://a.tiles.mapbox.com/v3/joshellington.map-xm12ru8v.jsonp', d);
  });
})

// Define a geojson data layer
// var geojsonLayer = new L.GeoJSON(data, {
//   pointToLayer: function (latlng) {
//     return new L.Marker(latlng, {
//       icon: new museumIcon()
//     });
//   }
// });

function update(term, tl_lat, tl_lng, br_lat, br_lng) {
  $.getJSON('http://api.yelp.com/business_review_search?term='+term+'&tl_lat='+tl_lat+'&tl_long='+tl_lng+'&br_lat='+br_lat+'&br_long='+br_lng+'&limit=30&ywsid=WRKYQtsZN-0vUyGouB9GlQ&callback=?', function(d) {
    markers(d);
  });
}

function markers(d) {
  list(d);

  $.each(d.businesses, function(i,item) {
    // log(item);
    var loc = new L.LatLng(item.latitude, item.longitude);

    var Icon = L.Icon.extend({
      iconUrl: 'img/icons/bar-24.png',
      shadowUrl: null,
      iconSize: new L.Point(24, 24),
      shadowSize: null,
      iconAnchor: new L.Point(12, 24),
      popupAnchor: new L.Point(0,-24)
    });

    var marker = new L.Marker(loc, {
      icon: new Icon()
    });

    marker.bindPopup('<h2>'+item.name+'</h2><img src="'+item.rating_img_url+'">');

    map.addLayer(marker);
  });
}

function createMap(url, data) {
  // Define the map to use from MapBox
  // This is the TileJSON endpoint copied from the embed button on your map
  // var url = 'http://a.tiles.mapbox.com/v3/joshellington.map-xm12ru8v.jsonp';

  // Make a new Leaflet map in your container div
  map = new L.Map('mapbox')  // container's id="mapbox"

  // Center the map on Washington, DC, at zoom 15
  .setView(new L.LatLng(38.9, -77.035), 15);

  // Get metadata about the map from MapBox
  wax.tilejson(url, function(tilejson) {
      // Add MapBox Streets as a base layer
      map.addLayer(new wax.leaf.connector(tilejson));
      
      markers(data);
  });

  map.on('moveend', function(e) {
    log(map.getBounds());

    var tl = map.getBounds().getNorthWest();
    var br = map.getBounds().getSouthEast();
    update(term, tl.lat, tl.lng, br.lat, br.lng);
  });
}

function list(d) {
  var cont = $('#list ul');

  cont.empty();

  $.each(d.businesses, function(i,item) {
    cont.append('<li><h3>'+item.name+'</h3><h4>'+item.address1+', '+item.city+', '+item.state+'</h4><img src="'+item.rating_img_url+'">');
  });
}
/*eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXNpeWFoemFoZWVtIiwiYSI6ImNsOTFpYjM2MDBtb2wzbnBtdDFkMnNmb3AifQ.h6qi9HrzoX89GMK8K106PA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/asiyahzaheem/cl95rh6cl000g14qg46j6ei4i',
    scrollZoom: false,
  });
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker(el, { anchor: 'bottom' })
      .setLngLat(loc.coordinates)
      .addTo(map);
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //entend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};

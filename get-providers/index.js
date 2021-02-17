const axios = require('axios');
const { parseString } = require('xml2js');
const fs = require('fs');

const placesURL = 'https://www.google.com/maps/d/u/0/kml?mid=1x9KT3SJub0igOTnhFtdRYmceZuBXMWvK&nl=1&forcekml=1';

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

async function geocodeAddress(address) {
  const { data } = await axios.get(`https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(address)}&polygon_geojson=1&format=jsonv2`);
  if (!data.length) {
    return {
      latitude: 0,
      longitude: 0,
    };
  }
  const result = data[0];
  return {
    latitude: result.lat,
    longitude: result.lon,
  };
}

async function getPlaces() {
  const { data: xml } = await axios.get(placesURL);
  const document = await parseXML(xml);
  const innerUrl = document.kml.Document[0].NetworkLink[0].Link[0].href[0];
  const { data: innerXML } = await axios.get(innerUrl);
  const innerDocument = await parseXML(innerXML);
  const xmlPlaces = innerDocument.kml.Document[0].Folder[0].Placemark;
  const places = [];
  await xmlPlaces.reduce(async (promise, place) => {
    await promise;
    try {
      const address = place.address[0];
      const location = await geocodeAddress(address);
      console.log({ address, location });
      places.push({
        name: place.name[0],
        address,
        description: place.description[0],
        location,
      });
      await fs.promises.writeFile('places.json', JSON.stringify(places, null, 2), 'utf8');
    } catch (error) {
      console.log('error geocoding', place.address[0]);
    }
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }, Promise.resolve());
  await fs.promises.writeFile('places.json', JSON.stringify(places, null, 2), 'utf8');
  console.log('DONE!');
}

getPlaces();

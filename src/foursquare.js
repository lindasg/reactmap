
const sortName = (a, b) => {
  // remove case senstivity
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  // if names are equal
  return 0;
};

// url and params
const fSURL = 'https://api.foursquare.com/v2/venues/';
const VERS = '20180504';
const RADIUS = '1000';
const CLIENT_ID = 'VRMJPPHYDQ0JG4IACF5JQTBDF5GRX2EM01L1ETXDCT4LFKZL';
const CLIENT_SECRET = '0M10RR2UMOUXCQRPSE5XJHQ5I2SF4CH0IRFOJQPALFG1EFON';
const CATEGORY_ID = '4bf58dd8d48988d181941735';

export const getFSLocations = (mapCenter) => {

  const requestURL = `${fSURL}search?ll=${mapCenter.lat},${mapCenter.lng}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERS}&categoryId=${CATEGORY_ID}&radius=${RADIUS}&limit=50`
  return fetch(requestURL)
  .then(response => {
      if (!response.ok) {
        throw response
      } else  return response.json()
    })
  .then(data => {
    const places = data.response.venues;

    // sort before updating state
    places.sort(sortName);

    return places;
  })

}

export const getFSDetails = (fsid) => {
  // use Foursquare id for search
  const FSID =  fsid;

  const requestURL = `${fSURL}${FSID}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERS}`
  return  fetch(requestURL)
  .then(response => {
      if (!response.ok) {
        throw response
      } else  return response.json()
    })
}

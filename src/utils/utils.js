import Toast from 'react-native-toast-message';

export const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.09,
  longitudeDelta: 0.035,
};

export const isInPolygon = (point, polygonArray) => {
  let x = point.latitude;
  let y = point.longitude;

  let inside = false;
  for (
    let i = 0, j = polygonArray.length - 1;
    i < polygonArray.length;
    j = i++
  ) {
    let xLat = polygonArray[i].latitude;
    let yLat = polygonArray[i].longitude;
    let xLon = polygonArray[j].latitude;
    let yLon = polygonArray[j].longitude;

    let intersect =
      yLat > y !== yLon > y &&
      x < ((xLon - xLat) * (y - yLat)) / (yLon - yLat) + xLat;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const toastMessage = (toastMessage, type = 'info') => {
  Toast.show({
    type: type,
    text1: toastMessage,
    visibilityTime: 1500,
  });
};

export const calculateArea = polygon => {
  let sum = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    sum +=
      polygon[i].latitude * polygon[j].longitude -
      polygon[j].latitude * polygon[i].longitude;
  }
  const area =
    Math.abs(sum / 2) *
    111319.9 *
    111319.9 *
    Math.cos(polygon[0].latitude * (Math.PI / 180));
  return area.toFixed(2);
};

export const polygonCenterPoint = coordinates => {
  let latitudeSum = 0;
  let longitudeSum = 0;
  coordinates.forEach(point => {
    latitudeSum += point.latitude;
    longitudeSum += point.longitude;
  });
  const latitudeAvg = latitudeSum / coordinates.length;
  const longitudeAvg = longitudeSum / coordinates.length;
  return {latitude: latitudeAvg, longitude: longitudeAvg};
};

let baseName = 'polygon';
let count = 1;
export const generateUniqueName = () => {
  let name = `${baseName}_${count}`;
  count++;
  return name;
};

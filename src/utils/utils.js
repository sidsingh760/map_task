import Toast from 'react-native-toast-message';

export const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.09,
  longitudeDelta: 0.035,
};

export const _isInPolygon = (point, polygonArray) => {
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

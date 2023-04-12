import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polygon, PROVIDER_GOOGLE} from 'react-native-maps';
import {_isInPolygon, initialRegion, toastMessage} from '../../utils/utils';
import {styles} from './styles';
import Toast from 'react-native-toast-message';

const MapScreen = () => {
  const [polygon, setPolygon] = useState([]);
  const [dropPins, setDropPins] = useState([]);
  const [isDraw, setIsDraw] = useState(true);

  const handleDrawMapPress = event => {
    const {coordinate} = event.nativeEvent;
    setPolygon([...polygon, coordinate]);
  };

  const handleMapPress = event => {
    const {coordinate} = event.nativeEvent;
    const value = _isInPolygon(coordinate, polygon);
    if (value) {
      setDropPins([...dropPins, coordinate]);
    } else {
      toastMessage('please drop pin inside the selected area!');
    }
  };

  const handleMarkerDragEnd = (event, index) => {
    const {coordinate} = event.nativeEvent;
    const value = _isInPolygon(coordinate, polygon);
    if (value) {
      const newDropPins = [...dropPins];
      newDropPins[index] = coordinate;
      setDropPins(newDropPins);
    } else {
      toastMessage('You can drag marker only in selected area.', 'error');
      setDropPins([...dropPins]);
    }
  };

  const onDrawDone = () => {
    setIsDraw(false);
  };

  const onDrawReset = () => {
    setIsDraw(true);
    setPolygon([]);
    setDropPins([]);
  };

  return (
    <View style={styles.container}>
      {polygon.length === 0 && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Please Draw the area on map</Text>
        </View>
      )}
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onPress={isDraw ? handleDrawMapPress : handleMapPress}>
          {polygon.length > 0 && (
            <Polygon
              coordinates={polygon}
              strokeColor="#076df2"
              fillColor="rgba(164, 235, 237,0.5)"
            />
          )}

          {polygon?.map((point, index) => (
            <Marker key={index} coordinate={point}>
              <View style={styles.polygon} />
            </Marker>
          ))}

          {dropPins?.map((coordinates, index) => (
            <Marker
              key={Math.random()}
              coordinate={coordinates}
              draggable
              onDragEnd={e => handleMarkerDragEnd(e, index)}
            />
          ))}
        </MapView>
      </View>

      {polygon?.length > 2 && (
        <TouchableOpacity
          style={styles.button}
          onPress={isDraw ? onDrawDone : onDrawReset}>
          <Text style={styles.buttonText}>{isDraw ? 'Done' : 'Reset'}</Text>
        </TouchableOpacity>
      )}
      <Toast position="top" />
    </View>
  );
};

export default MapScreen;

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import MapView, {Marker, Polygon, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  calculateArea,
  generateUniqueName,
  initialRegion,
  isInPolygon,
  polygonCenterPoint,
  toastMessage,
} from '../../utils/utils';
import {styles} from './styles';
import Toast from 'react-native-toast-message';
import PolygonListModal from '../../component/PoligonListModal';
import Prompt from 'react-native-input-prompt';

const MapScreen = () => {
  const mapRef = React.createRef();
  const [dropPins, setDropPins] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [polygonModal, setPolygonModal] = useState(false);
  const [editPromptId, setEditPromptId] = useState('');
  const [handlePolygon, setHandlePolygon] = useState({
    polygon: [],
    polygonArray: [],
    selectedPolygonHighlight: [],
  });

  const handleDrawMapPress = event => {
    const {coordinate} = event.nativeEvent;
    setHandlePolygon({
      ...handlePolygon,
      polygon: [...handlePolygon.polygon, coordinate],
    });
  };

  const polygonModalShow = () => {
    setPolygonModal(!polygonModal);
  };

  const handleMapPress = event => {
    const {coordinate} = event.nativeEvent;
    const isInsidePolygon = handlePolygon.polygonArray?.some(singlePolygon => {
      return isInPolygon(coordinate, singlePolygon?.coordinates);
    });
    if (!isInsidePolygon) {
      toastMessage('Please drop pin inside the selected area!');
      return;
    }
    setDropPins([...dropPins, coordinate]);
  };

  const handleMarkerDragEnd = (event, index) => {
    const {coordinate} = event.nativeEvent;
    const isInsidePolygon = handlePolygon?.polygonArray?.some(singlePolygon => {
      return isInPolygon(coordinate, singlePolygon?.coordinates);
    });
    if (!isInsidePolygon) {
      toastMessage('You can drag marker only in selected area.', 'error');
      setDropPins([...dropPins]);
      return;
    }
    const newDropPins = [...dropPins];
    newDropPins[index] = coordinate;
    setDropPins(newDropPins);
  };

  const onDrawSave = () => {
    setIsDraw(false);
    let polygonValue = handlePolygon?.polygon;
    const newPolygon = {
      id: Math.random().toString(16).slice(2),
      coordinates: polygonValue,
      centerPoint: polygonCenterPoint(polygonValue),
      polygonSquareFeet: calculateArea(polygonValue),
      polyName: generateUniqueName(),
      isSelected: false,
    };
    setHandlePolygon({
      ...handlePolygon,
      polygon: [],
      polygonArray: [...handlePolygon.polygonArray, newPolygon],
    });
  };

  const selectedPolygon = selectedPolygon => {
    const {centerPoint, coordinates, id} = selectedPolygon;
    mapRef.current.animateToRegion({
      ...centerPoint,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    const newPolygonArray = handlePolygon?.polygonArray.map(item => {
      if (item.id === id) {
        return {...item, isSelected: true};
      }
      return {...item, isSelected: false};
    });
    setHandlePolygon({
      ...handlePolygon,
      polygonArray: newPolygonArray,
      selectedPolygonHighlight: coordinates,
    });
    setPolygonModal(false);
  };

  const deletePolygon = (polygonId, coordinates) => {
    const newPolygonArray = handlePolygon.polygonArray.filter(
      item => item.id !== polygonId,
    );
    const newDropPinsArray = dropPins.filter(item => {
      return !isInPolygon(item, coordinates);
    });
    setDropPins(newDropPinsArray);
    setHandlePolygon({
      ...handlePolygon,
      polygonArray: newPolygonArray,
      selectedPolygonHighlight: [],
    });
  };

  const editPolygonName = (id, text) => {
    const newPolygonArray = handlePolygon.polygonArray.map(item => {
      if (item.id === id) {
        return {...item, polyName: text};
      }
      return item;
    });
    setHandlePolygon({
      ...handlePolygon,
      polygonArray: newPolygonArray,
    });
    setEditPromptId('');
  };

  const createPolygon = () => {
    setIsDraw(true);
    setHandlePolygon({
      ...handlePolygon,
      selectedPolygonHighlight: [],
    });
  };

  const deleteAlert = (polygonId, coordinates) =>
    Alert.alert('Delete Polygon', 'Are you sure want to delete a Polygon ', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deletePolygon(polygonId, coordinates)},
    ]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <MapView
          key={2}
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onPress={isDraw ? handleDrawMapPress : handleMapPress}>
          {handlePolygon?.polygonArray?.map((item, index) => {
            return (
              <Polygon
                key={item.id}
                coordinates={item.coordinates}
                strokeColor="#076df2"
                fillColor="rgba(164, 235, 237,0.5)"
              />
            );
          })}

          {handlePolygon?.polygonArray?.map((item, index) => {
            return (
              <Marker
                key={item.id}
                coordinate={item.centerPoint}
                onPress={e => {
                  e.stopPropagation();
                  setEditPromptId(item.id);
                }}>
                <View style={styles.pointView}>
                  <Text style={styles.nameText}>{item.polyName}</Text>
                  <Image
                    source={require('../../assets/images/pencil.png')}
                    style={{width: 15, height: 15, marginLeft: 5}}
                  />
                </View>
              </Marker>
            );
          })}

          {handlePolygon.polygon?.length > 0 && (
            <Polygon
              coordinates={handlePolygon.polygon}
              strokeColor="#076df2"
              fillColor="rgba(164, 235, 237,0.5)"
            />
          )}

          {handlePolygon?.selectedPolygonHighlight.length > 0 && (
            <Polygon
              coordinates={handlePolygon?.selectedPolygonHighlight}
              strokeColor="#076df2"
              fillColor="#749ef7"
            />
          )}

          {handlePolygon.polygon?.map((point, index) => (
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

      <TouchableOpacity
        style={styles.createButton}
        onPress={
          handlePolygon.polygon?.length > 2 ? onDrawSave : createPolygon
        }>
        <Text style={styles.btnText}>
          {handlePolygon.polygon?.length > 2
            ? 'Save Polygon'
            : 'Create Polygon'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.polygonList} onPress={polygonModalShow}>
        <Text style={styles.btnText}>polygon List</Text>
      </TouchableOpacity>

      <PolygonListModal
        modalShow={polygonModal}
        onPress={polygonModalShow}
        polygonList={handlePolygon?.polygonArray}
        selectedPolygon={selectedPolygon}
        deletePolygon={deleteAlert}
      />
      <Prompt
        visible={!!editPromptId}
        title="Enter Polygon Name"
        placeholder="Enter Polygon Name"
        onCancel={() => {
          setEditPromptId('');
        }}
        onSubmit={text => {
          editPolygonName(editPromptId, text);
        }}
      />
      <Toast position="top" />
    </View>
  );
};

export default MapScreen;

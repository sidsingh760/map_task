import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

const PolygonListModal = props => {
  const {onPress, modalShow, polygonList, selectedPolygon, deletePolygon} =
    props;
  return (
    <Modal
      transparent={true}
      animationType={'slide'}
      visible={modalShow}
      supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.modalBackground}>
        <View style={styles.modalInsideWhiteArea}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Save Polygon List</Text>
            <TouchableOpacity style={styles.crossBtn} onPress={onPress}>
              <Image source={require('../assets/images/cross.png')} />
            </TouchableOpacity>
          </View>
          {polygonList.length > 0 ? (
            <ScrollView style={{marginTop: '5%'}} bounces={false}>
              {polygonList.map((item, index) => {
                return (
                  <View
                    style={[
                      styles.polygonCard,
                      {
                        backgroundColor: !item.isSelected
                          ? 'rgba(164, 235, 237,0.5)'
                          : '#3f9beb',
                      },
                    ]}
                    key={item.id}>
                    <TouchableOpacity onPress={() => selectedPolygon(item)}>
                      <Text>Id : {item.id}</Text>
                      <Text>Name : {item.polyName}</Text>
                      <Text>Square Feet Area : {item.polygonSquareFeet}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        deletePolygon(item?.id, item.coordinates);
                      }}>
                      <Image
                        source={require('../assets/images/delete.png')}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.messageCtn}>
              <Text style={styles.noList}>
                No Polygon List Found,{'\n'} Please Save The Polygon
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalInsideWhiteArea: {
    height: '80%',
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '2%',
    marginTop: 7,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 22,
    color: '#3f9beb',
  },
  polygonCard: {
    backgroundColor: 'rgba(164, 235, 237,0.5)',
    margin: '3%',
    padding: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  messageCtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  noList: {
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 2,
    color: 'red',
    textAlign: 'center',
  },
  image: {
    height: 20,
    width: 20,
  },
  crossBtn: {
    position: 'absolute',
    right: '6%',
  },
});

export default PolygonListModal;

import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoBox: {
    position: 'absolute',
    bottom: 30,
    zIndex: 1,
    backgroundColor: '#3f9beb',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#fff',
  },
  polygon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#076df2',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#3f9beb',
    width: '90%',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

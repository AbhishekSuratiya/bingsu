import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};

const getData = async key => await AsyncStorage.getItem(key);

const removeData = async key => await AsyncStorage.removeItem(key);

export { storeData, getData, removeData };

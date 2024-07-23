import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';

const config =
    Platform.OS === 'ios'
        ? { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        : {};

export const getGeoLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        return Geolocation.requestAuthorization();
    }
};

export const getLocationCoordinates = async () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (response) => {
                resolve({ response, errorMsg: null });
            },
            (error) => {
                if (error.code === 1 || error.code === 2) {
                    resolve({
                        response: null,
                        errorMsg:
                            'Please enable access to location services in phone settings',
                    });
                }
                resolve({ response: null, errorMsg: error.message });
            },
            config,
        );
    });
};
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Geocoder, GeocoderRequest, LatLng } from "@ionic-native/google-maps";

@Injectable()
export class GeolocationService {
    private _geolocation = new Geolocation();
    private _geocoder = new Geocoder();

    public getPosition(): Promise<Geoposition> {
        return this._geolocation.getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: true
        });
    }

    public getPositionFromAddress(address: string): Promise<LatLng> {
        let request: GeocoderRequest = { 'address': address };
        let position: LatLng;

        return new Promise((resolve, reject) => {
            this._geocoder.geocode(request)
                .then((results) => {
                    if (results.length) {
                        position = results[0].position;
                    }
                    resolve(position);
                })
                .catch((err) => reject(err));
        });
    }

}

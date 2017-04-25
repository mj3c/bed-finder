import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@Injectable()
export class GeolocationService {
  private _geolocation = new Geolocation();

  public getPosition(): Promise<Geoposition> {
    return this._geolocation.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: true
    });
  }

}

import { AfterViewInit, Component } from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, LatLng } from "@ionic-native/google-maps";

import { AccommodationService } from "../../providers/accommodation-service";
import { GeolocationService } from "../../providers/geolocation-service";

@IonicPage()
@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
})
export class MapPage implements AfterViewInit {
    private _map: GoogleMap;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _accommodationService: AccommodationService,
                private _geolocationService: GeolocationService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Map');
    }

    ngAfterViewInit() {
        this.loadMap();
    }

    loadMarkers(): void {
        this._accommodationService.getAccommodations()
            .forEach(acc => {
                let coords: LatLng = new LatLng(acc.coordinates.lat, acc.coordinates.lon);
                let name: string = acc.name;

                this._map.addMarker({
                    position: coords,
                    title: name
                })
            });
    }

    panMapTo(position: LatLng) {
        let mapOptions: any = {
            'controls': {
                'compass': true,
                'myLocationButton': true,
                'zoom': true
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true,
            },
            'camera': {
                'latLng': position,
                'zoom': 15,
            },
        }

        this._map.setOptions(mapOptions);
    }

    loadMap() {
        this._geolocationService.getPosition()
            .then(position => {
                let center = new LatLng(position.coords.latitude, position.coords.longitude);
                this._map = new GoogleMap('map');
                this._map.one(GoogleMapsEvent.MAP_READY)
                    .then(_ => {
                        this.loadMarkers();
                        console.log('lulz');
                        this.panMapTo(center);
                    });
            });
    }
}

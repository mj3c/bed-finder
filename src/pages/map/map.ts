import { AfterViewInit, Component } from '@angular/core';

import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, LatLng, LatLngBounds, Marker } from "@ionic-native/google-maps";

import { AccommodationService, AccommodationType } from "../../providers/accommodation-service";
import { GeolocationService } from "../../providers/geolocation-service";
import { FilterService, SearchTerms } from "../../providers/filter-service";

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
})
export class MapPage implements AfterViewInit {
    private _map: GoogleMap;
    private _markers: Marker[];
    private _terms: SearchTerms;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _loadingCtrl: LoadingController,
                private _accommodationService: AccommodationService,
                private _geolocationService: GeolocationService,
                private _filterService: FilterService
    ) {
        this._markers = [];
        this._terms = navParams.get('data');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Map');
    }

    ngAfterViewInit() {
        this.loadMap();
    }

    loadMarkers(accs: AccommodationType[]): void {
        this._map.clear();
        accs.forEach(acc => {
            let coords: LatLng = new LatLng(acc.coordinates.lat, acc.coordinates.lon);
            let name: string = acc.name;
            let desc: string = acc.description;

            this._map.addMarker({
                position: coords,
                title: name,
                styles: { maxWidth: "80%"},
                disableAutoPan: true
            }).then(marker => this._markers.push(marker));
        });
    }

    setMapOptions(position: LatLng): void {
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
                'zoom': 13,
            },
        };

        this._map.setOptions(mapOptions);
    }

    loadMap() {
        let loading = this._loadingCtrl.create({
            content: `Finding cozy beds...`
        });
        loading.present();

        this._geolocationService.getPosition()
            .then(position => {
                let center = new LatLng(position.coords.latitude, position.coords.longitude);
                this._map = new GoogleMap('map');
                this._map.one(GoogleMapsEvent.MAP_READY)
                    .then(_ => {
                        this._accommodationService.accommodationsSubject
                            .subscribe(accs => this.loadMarkers(accs));

                        this._map.on(GoogleMapsEvent.CAMERA_CHANGE)
                            .subscribe(_ => this.mapCameraMoved());

                        this._filterService.filterSubject
                            .subscribe((terms: SearchTerms) => {
                                if (terms.coords) {
                                    center = terms.coords;
                                }
                                this.setMapOptions(center);
                                loading.dismiss();
                            });
                    });
            });
    }

    mapCameraMoved(): void {
        this._map.getVisibleRegion()
            .then((latLonBounds: LatLngBounds) => {
                this._accommodationService.filterAccommodations(
                    latLonBounds,
                    this._terms.info
                )
            });
    }
}

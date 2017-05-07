import { AfterViewInit, Component } from '@angular/core';

import { LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, LatLng, LatLngBounds, Marker } from "@ionic-native/google-maps";

import { AccommodationService, AccommodationType } from "../../providers/accommodation-service";
import { GeolocationService } from "../../providers/geolocation-service";
import { FilterService, SearchTerms } from "../../providers/filter-service";

enum Mode {
    BROWSE_ACCOMMODATIONS,
    SELECT_LOCATION
}

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
})
export class MapPage implements AfterViewInit {
    private _mode: Mode = Mode.BROWSE_ACCOMMODATIONS;
    private _map: GoogleMap;
    private _markers: Marker[];
    private _terms: SearchTerms = {
        area: '',
        info: '',
        coords: null
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _loadingCtrl: LoadingController,
                private _toastCtrl: ToastController,
                private _accommodationService: AccommodationService,
                private _geolocationService: GeolocationService,
                private _filterService: FilterService
    ) {
        this._markers = [];
        let data: any = navParams.get('data');
        if (data && data.terms) {
            this._mode = Mode.BROWSE_ACCOMMODATIONS;
            this._terms = data.terms
        }
        if (data && data.chooseLocation) {
            this._mode = Mode.SELECT_LOCATION;
        }
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
            content: (this._mode === Mode.BROWSE_ACCOMMODATIONS)
                ? 'Finding cozy beds...'
                : 'Loading map...'
        });
        loading.present();

        this._geolocationService.getPosition()
            .then(position => {
                this._map = new GoogleMap('map');
                let center: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
                this._map.one(GoogleMapsEvent.MAP_READY)
                    .then(_ => {
                        loading.dismiss();
                        if (this._mode === Mode.BROWSE_ACCOMMODATIONS) {
                            this.setupMapForBrowsing(center);
                        } else if (this._mode === Mode.SELECT_LOCATION) {
                            this.setupMapForSelectingLocation(center);
                        }
                    })
                    .catch(err => alert(err));
            })
            .catch(err => alert(err));
    }

    setupMapForBrowsing(center: LatLng) {
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
            });
    }

    setupMapForSelectingLocation(center: LatLng) {
        this.setMapOptions(center);
        let toast = this._toastCtrl.create({
            message: 'Tap a location',
            position: 'bottom'
        });
        this._map.one(GoogleMapsEvent.MAP_CLICK)
            .then((position) => {
                toast.dismiss();
                this.navParams.get('data').positionReturned(position);
                this.navCtrl.pop();
            });
        toast.present();
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

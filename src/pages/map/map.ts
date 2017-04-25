import { AfterViewInit, Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, LatLng } from "@ionic-native/google-maps";
import { AccommodationService } from "../../providers/accommodation-service";

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage implements AfterViewInit {
  private _map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _accommodationService: AccommodationService
  ) {
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
        let name: string   = acc.name;

        this._map.addMarker({
          position: coords,
          title: name
        })
      });
  }

  loadMap() {
    this._map = new GoogleMap('map');
    this._map.one(GoogleMapsEvent.MAP_READY)
      .then(_ => {
        this.loadMarkers();
      });
  }

}

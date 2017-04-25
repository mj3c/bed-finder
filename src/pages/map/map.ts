import { AfterViewInit, Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMap, GoogleMaps, GoogleMapsEvent } from "@ionic-native/google-maps";

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
    private _googleMaps: GoogleMaps
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Map');
  }

  ngAfterViewInit() {
    console.log('afterviewinit call');
    this.loadMap();
  }

  loadMap() {
    this._map = new GoogleMap('map');
    console.log('map object created');
    this._map.one(GoogleMapsEvent.MAP_READY)
      .then(_ => {
        console.log('Map woohoo!');
      });
  }

}

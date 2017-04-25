import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccommodationType } from '../../providers/accommodation-service';

@IonicPage()
@Component({
  selector: 'page-accommodation',
  templateUrl: 'accommodation.html',
})
export class Accommodation {
  public accommodation: AccommodationType;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.accommodation = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Accommodation');
  }

}

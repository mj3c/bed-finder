import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Accommodation, AccommodationType } from '../accommodation/accommodation';

@IonicPage()
@Component({
  selector: 'page-accommodations',
  templateUrl: 'accommodations.html',
})
export class Accommodations {
  public accommodations: AccommodationType[] = [
    {name: 'Accomm 1', description: '\'Tis a silly place.', coordinates: {lat: 10, lon:20}},
    {name: 'Accomm 2', description: 'Now this place is special.', coordinates: {lat: 10, lon:20}},
    {name: 'Accomm 3', description: 'Place threeee!', coordinates: {lat: 10, lon:20}},
    {name: 'Accomm 4', description: 'A fourth one as well.', coordinates: {lat: 10, lon:20}}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  accommodationSelected(acc: AccommodationType): void {
    this.navCtrl.push(Accommodation, {
      data: {
        name: acc.name,
        description: acc.description,
        coordinates: acc.coordinates
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Accommodations');
  }

}

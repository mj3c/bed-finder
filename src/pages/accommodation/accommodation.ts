import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AccommodationType } from '../../providers/accommodation-service';

@Component({
    selector: 'page-accommodation',
    templateUrl: 'accommodation.html',
})
export class AccommodationPage {
    public accommodation: AccommodationType;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.accommodation = navParams.get('data');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Accommodation');
    }

}

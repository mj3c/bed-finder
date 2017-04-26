import { AfterViewInit, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AccommodationPage } from '../accommodation/accommodation';
import { AccommodationType, AccommodationService } from '../../providers/accommodation-service';

@IonicPage()
@Component({
    selector: 'page-accommodations',
    templateUrl: 'accommodations.html',
})
export class AccommodationsPage implements AfterViewInit {
    public accommodations: AccommodationType[];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _accommodationService: AccommodationService) {
    }

    accommodationSelected(acc: AccommodationType): void {
        this.navCtrl.push(AccommodationPage, {
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

    ngAfterViewInit() {
        this.accommodations = this._accommodationService.getAccommodations();
    }

}

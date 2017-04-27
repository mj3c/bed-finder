import { AfterViewInit, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AccommodationPage } from '../accommodation/accommodation';
import { AccommodationType, AccommodationService } from '../../providers/accommodation-service';
import { EditAccommodationPage } from "../edit-accommodation/edit-accommodation";

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

    ionViewDidLoad() {
        console.log('ionViewDidLoad Accommodations');
    }

    ngAfterViewInit() {
        this.accommodations = this._accommodationService.getAccommodations();
    }

    accommodationClicked(acc: AccommodationType): void {
        this.navCtrl.push(AccommodationPage, {
            data: {
                id: acc.id,
                name: acc.name,
                description: acc.description,
                coordinates: acc.coordinates
            }
        });
    }

    accommodationPressed(acc: AccommodationType): void {
        this.navCtrl.push(EditAccommodationPage, {
            data: {
                id: acc.id,
                name: acc.name,
                description: acc.description,
                coordinates: acc.coordinates
            }
        });
    }

    newAccommodation(): void {
        this.navCtrl.push(EditAccommodationPage, {
            data: {}
        });
    }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AccommodationPage } from '../accommodation/accommodation';
import { AccommodationType, AccommodationService } from '../../providers/accommodation-service';
import { EditAccommodationPage } from "../edit-accommodation/edit-accommodation";

@Component({
    selector: 'page-accommodations',
    templateUrl: 'accommodations.html',
})
export class AccommodationsPage {
    public accommodations: AccommodationType[];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _accommodationService: AccommodationService
    ) {
        this._accommodationService.accommodationsSubject
            .subscribe(accs => {
                this.accommodations = accs;
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Accommodations');
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

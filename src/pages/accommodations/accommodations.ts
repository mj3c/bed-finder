import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams } from 'ionic-angular';

import { AccommodationPage } from '../accommodation/accommodation';
import { AccommodationType, AccommodationService } from '../../providers/accommodation-service';
import { EditAccommodationPage } from "../edit-accommodation/edit-accommodation";
import { SharingService } from "../../providers/sharing-service";

@Component({
    selector: 'page-accommodations',
    templateUrl: 'accommodations.html',
})
export class AccommodationsPage {
    public accommodations: AccommodationType[];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _actionSheetCtrl: ActionSheetController,
                private _accommodationService: AccommodationService,
                private _sharingService: SharingService
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

    shareClicked(acc): void {
        // let actionSheet = this._actionSheetCtrl.create({
        //     title: 'Share via',
        //     buttons: [
        //         {
        //             text: 'Facebook',
        //             icon: 'facebook',
        //             handler: () => {
        //                 this._sharingService.share(acc, SharingPlatform.FACEBOOK);
        //             }
        //         },
        //         {
        //             text: 'Twitter',
        //             icon: 'twitter',
        //             handler: () => {
        //                 this._sharingService.share(acc, SharingPlatform.TWITTER);
        //             }
        //         }
        //     ]
        // });
        //
        // actionSheet.present();
        this._sharingService.share(acc);
    }

}

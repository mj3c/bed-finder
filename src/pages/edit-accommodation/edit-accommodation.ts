import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccommodationService, AccommodationType } from "../../providers/accommodation-service";

@IonicPage()
@Component({
    selector: 'page-edit-accommodation',
    templateUrl: 'edit-accommodation.html',
})
export class EditAccommodationPage {
    public accommodation: AccommodationType;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _accommodationService: AccommodationService
    ) {
        let accId: string = navParams.get('data')['id'];
        this.accommodation = this._accommodationService.getAccommodation(accId);
    }

    save(): void {
        this._accommodationService.editAccommodation(this.accommodation);
        this.navCtrl.pop();
    }

    cancel(): void {
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditAccommodation');
    }

}

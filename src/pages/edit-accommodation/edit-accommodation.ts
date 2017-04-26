import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AccommodationService, AccommodationType } from "../../providers/accommodation-service";
import { GeolocationService } from "../../providers/geolocation-service";

@IonicPage()
@Component({
    selector: 'page-edit-accommodation',
    templateUrl: 'edit-accommodation.html',
})
export class EditAccommodationPage {
    public accommodation: AccommodationType;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _loadingCtrl: LoadingController,
                private _geolocationService: GeolocationService,
                private _accommodationService: AccommodationService
    ) {
        let accId: string = navParams.get('data')['id'];
        this.accommodation = this._accommodationService.getAccommodation(accId);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditAccommodation');
    }

    chooseLocation(): void {
        let loading = this._loadingCtrl.create({
            content: 'Fetching current location...'
        });
        loading.present();

        this._geolocationService.getPosition()
            .then(position => {
                this.accommodation.coordinates.lat = position.coords.latitude;
                this.accommodation.coordinates.lon = position.coords.longitude;
                loading.dismiss();
            });
    }

    save(): void {
        this._accommodationService.editAccommodation(this.accommodation);
        this.navCtrl.pop();
    }

    cancel(): void {
        this.navCtrl.pop();
    }

}

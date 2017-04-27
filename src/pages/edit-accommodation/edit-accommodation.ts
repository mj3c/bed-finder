import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AccommodationService, AccommodationType } from "../../providers/accommodation-service";
import { GeolocationService } from "../../providers/geolocation-service";

enum Mode {
    edit = 1,
    add = 2
}

@IonicPage()
@Component({
    selector: 'page-edit-accommodation',
    templateUrl: 'edit-accommodation.html',
})
export class EditAccommodationPage {
    private _mode: Mode;
    public accommodation: AccommodationType = {
        id: Date.now(),
        name: '',
        description: '',
        coordinates: {
            lat: 0,
            lon: 0
        }
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _loadingCtrl: LoadingController,
                private _alertCtrl: AlertController,
                private _geolocationService: GeolocationService,
                private _accommodationService: AccommodationService
    ) {
        let accId: number = navParams.get('data')['id'];
        if (accId) {
            this._mode = Mode.edit;
            this.accommodation = this._accommodationService.getAccommodation(accId);
        } else {
            this._mode = Mode.add;
        }
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
            })
            .catch((error: PositionError) => {
                loading.dismiss();
                alert(`Fetching error: '${error.message}'. Please try again after a brief period.`);
            });
    }

    save(): void {
        if (this._mode === Mode.edit) {
            this._accommodationService.editAccommodation(this.accommodation);
        } else if (this._mode === Mode.add) {
            this._accommodationService.addAccommodation(this.accommodation);
        }
        this.navCtrl.pop();
    }

    cancel(): void {
        this.navCtrl.pop();
    }

    delete(): void {
        let confirmationAlert = this._alertCtrl.create({
            title: "Are you sure?",
            message: `If you choose YES, accommodation '${this.accommodation.name}' will permanently be deleted.`,
            buttons: [
                {
                    text: 'No'
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this._accommodationService.deleteAccommodation(this.accommodation.id);
                        this.navCtrl.pop();
                    }
                }
            ]
        });
        confirmationAlert.present();
    }

}

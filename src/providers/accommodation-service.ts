import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SqliteService } from "./sqlite-service";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { LatLng, LatLngBounds } from "@ionic-native/google-maps";

export interface AccommodationType {
    id: number;
    name: string;
    description: string;
    coordinates: {
        lat: number;
        lon: number;
    },
    image: string;
}

@Injectable()
export class AccommodationService {
    private _accommodations: AccommodationType[];
    private _filteredAccommodations: AccommodationType[];
    public accommodationsSubject: ReplaySubject<AccommodationType[]> = new ReplaySubject(1);

    constructor(private _sqliteService: SqliteService) {
        this._sqliteService.dbSubject
            .subscribe(_ => {
                this._sqliteService.getAccommodations()
                    .subscribe(accs => {
                        this._accommodations = accs;
                        this._filteredAccommodations = accs;
                        this.accommodationsSubject.next(this._accommodations);
                    });
            });
    }

    public getAccommodation(accId: number): AccommodationType {
        return this._accommodations.find(x => x.id === accId);
    }

    public addAccommodation(acc: AccommodationType): void {
        this._sqliteService.insertAccommodation(acc)
            .subscribe(_ => {
                this._accommodations.push(acc);
                this.accommodationsSubject.next(this._accommodations);
            });
    }

    public editAccommodation(acc: AccommodationType): void {
        this._sqliteService.updateAccommodation(acc)
            .subscribe(_ => {
                let oldAcc = this._accommodations.find(x => x.id === acc.id);
                let accIndex = this._accommodations.indexOf(oldAcc);
                this._accommodations[accIndex] = acc;
                this.accommodationsSubject.next(this._accommodations);
            });
    }

    public deleteAccommodation(accId: number): void {
        this._sqliteService.deleteAccommodation(accId)
            .subscribe(_ => {
                let acc = this._accommodations.find(x => x.id === accId);
                this._accommodations.splice(this._accommodations.indexOf(acc), 1);
                this.accommodationsSubject.next(this._accommodations);
            });
    }

    public filterAccommodations(latLonBounds: LatLngBounds, info: string): void {
        this._filteredAccommodations = this._accommodations.filter(acc => {
            let accPos: LatLng = new LatLng(acc.coordinates.lat, acc.coordinates.lon);
            // true if within bounds and either name or description contains the search term
            return latLonBounds.contains(accPos) && (
                acc.name.toLowerCase().indexOf(info) !== -1 ||
                acc.description.toLowerCase().indexOf(info) !== -1);
        });
        this.accommodationsSubject.next(this._filteredAccommodations);
    }
}

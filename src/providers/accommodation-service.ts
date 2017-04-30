import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SqliteService } from "./sqlite-service";
import { ReplaySubject } from "rxjs/ReplaySubject";

export interface AccommodationType {
    id: number;
    name: string;
    description: string;
    coordinates: {
        lat: number;
        lon: number;
    };
}

@Injectable()
export class AccommodationService {
    private _accommodations: AccommodationType[];
    public accommodationsSubject: ReplaySubject<AccommodationType[]> = new ReplaySubject(1);

    constructor(private _sqliteService: SqliteService) {
        this._sqliteService.dbSubject
            .subscribe(_ => {
                this._sqliteService.getAccommodations()
                    .subscribe(accs => {
                        this._accommodations = accs;
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
}

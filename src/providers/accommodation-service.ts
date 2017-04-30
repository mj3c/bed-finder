import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SqliteService } from "./sqlite-service";
import { Subject } from "rxjs/Subject";

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
    // private _accommodations: AccommodationType[] = [
    //     { id: 1, name: 'Accomm 1', description: '\'Tis a silly place.', coordinates: { lat: 10, lon: 25 } },
    //     { id: 2, name: 'Accomm 2', description: 'Now this place is special.', coordinates: { lat: 15, lon: 28 } },
    //     { id: 3, name: 'Accomm 3', description: 'Place threeee!', coordinates: { lat: 23, lon: 40 } },
    //     { id: 4, name: 'Accomm 4', description: 'A fourth one as well.', coordinates: { lat: 30, lon: 10 } }
    // ];
    private _accommodations: AccommodationType[];
    public accommodationsSubject: Subject<AccommodationType[]> = new Subject();

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

    public getAccommodations(): AccommodationType[] {
        return this._accommodations;
    }

    public getAccommodation(accId: number): AccommodationType {
        return this._accommodations.find(x => x.id === accId);
    }

    public addAccommodation(acc: AccommodationType): void {
        this._accommodations.push(acc);
        this.accommodationsSubject.next(this._accommodations);
    }

    public editAccommodation(acc: AccommodationType): void {
        let oldAcc = this._accommodations.find(x => x.id === acc.id);
        let accIndex = this._accommodations.indexOf(oldAcc);
        this._accommodations[accIndex] = acc;
        this.accommodationsSubject.next(this._accommodations);
    }

    public deleteAccommodation(accId: number): void {
        let acc = this._accommodations.find(x => x.id === accId);
        this._accommodations.splice(this._accommodations.indexOf(acc), 1);
        this.accommodationsSubject.next(this._accommodations);
    }

}

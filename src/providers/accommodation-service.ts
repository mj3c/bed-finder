import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

export interface AccommodationType {
    id: string;
    name: string;
    description: string;
    coordinates: {
        lat: number;
        lon: number;
    };
}

@Injectable()
export class AccommodationService {
    private _accommodations: AccommodationType[] = [
        { id: '1', name: 'Accomm 1', description: '\'Tis a silly place.', coordinates: { lat: 10, lon: 25 } },
        { id: '2', name: 'Accomm 2', description: 'Now this place is special.', coordinates: { lat: 15, lon: 28 } },
        { id: '3', name: 'Accomm 3', description: 'Place threeee!', coordinates: { lat: 23, lon: 40 } },
        { id: '4', name: 'Accomm 4', description: 'A fourth one as well.', coordinates: { lat: 30, lon: 10 } }
    ];

    constructor() {

    }

    public getAccommodations(): AccommodationType[] {
        return this._accommodations;
    }

    public addAccommodation(acc: AccommodationType): void {
        this._accommodations.push(acc);
    }

    public deleteAccommodation(accId: string): void {
        let acc = this._accommodations.find(x => x.id === accId);
        this._accommodations.splice(this._accommodations.indexOf(acc), 1);
    }

}

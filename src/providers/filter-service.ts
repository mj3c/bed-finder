import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { GeolocationService } from "./geolocation-service";
import { LatLng } from "@ionic-native/google-maps";

export interface SearchTerms {
    area: string;
    info: string;
    coords: LatLng;
}

@Injectable()
export class FilterService {
    private _filter: BehaviorSubject<SearchTerms>;
    public filterSubject: Observable<SearchTerms>;

    constructor(private _geolocationService: GeolocationService) {
        let terms: SearchTerms = { area: '', info: '', coords: null };
        this._filter = new BehaviorSubject(terms);
        this.filterSubject =  this._filter.asObservable();
    }

    setTerms(terms: SearchTerms) {
        this._geolocationService.getPositionFromAddress(terms.area)
            .then((position) => {
                terms.coords = position;
                this._filter.next(terms);
            });
    }
}

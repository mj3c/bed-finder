import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from "@ionic-native/sqlite";
import { Platform } from "ionic-angular";
import { AccommodationType } from "./accommodation-service";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

interface DBAccommodationType {
    id: number;
    name: string;
    description: string;
    lat: number;
    lon: number;
}

@Injectable()
export class SqliteService {

    private DATABASE_CREATE: string = '' +
        'create table if not exists Accommodations (' +
        'id integer primary key autoincrement not null,' +
        'name text not null,' +
        'description text,' +
        'lat real not null,' +
        'lon real not null)';
    private DATABASE_CONFIG: SQLiteDatabaseConfig = {
        name: 'bedfinder.db',
        location: 'default'
    };
    private _sqlite: SQLite = new SQLite();
    private _db: SQLiteObject;
    public dbSubject: Subject<boolean> = new Subject();

    constructor(private _platform: Platform) {
        this._platform.ready()
            .then(_ => {
                this._sqlite.create(this.DATABASE_CONFIG)
                    .then((db: SQLiteObject) => {
                        this._db = db;
                        this.dbSubject.next(true);
                        this._db.executeSql(this.DATABASE_CREATE, {})
                            .then(_ => {
                                console.log('Table Accommodations created!')
                            })
                            .catch((error) => {
                                console.log(`Error creating table: '${error}'`);
                            });
                    }).catch((error) => {
                    console.log(`Error creating database: '${error}'`)
                });
            });
    }

    private accommodationDbToDomain(acc: DBAccommodationType): AccommodationType {
        return {
            id: acc.id,
            name: acc.name,
            description: acc.description,
            coordinates: {
                lat: acc.lat,
                lon: acc.lon
            }
        };
    }

    public getAccommodations(): Observable<AccommodationType[]> {
        let accsSubject: Subject<AccommodationType[]> = new Subject();
        this._db.executeSql('select * from Accommodations', [])
            .then((results: SQLResultSet) => {
                let accommodations: AccommodationType[] = [];
                for (let i = 0; i < results.rows.length; i++) {
                    let dbAcc: DBAccommodationType = results.rows.item(i);
                    let domainAcc: AccommodationType = this.accommodationDbToDomain(dbAcc);
                    accommodations.push(domainAcc);
                }
                accsSubject.next(accommodations);
                accsSubject.complete();
            })
            .catch((error) => {
                console.log(`Error fetching accommodations: '${error}'`);
            });

        return accsSubject;
    }

    public insertAccommodation(acc: AccommodationType): Observable<boolean> {
        let insertSubject: Subject<boolean> = new Subject();
        let values = [acc.id, acc.name, acc.description, acc.coordinates.lat, acc.coordinates.lon];
        this._db.executeSql('' +
            'insert into Accommodations ' +
            '(id, name, description, lat, lon)' +
            'values (?, ?, ?, ?, ?)', values)
            .then((result) => {
                insertSubject.next(result);
                insertSubject.complete();
            })
            .catch((error) => {
                console.log(`Error adding accommodation: '${error}'`);
            });

        return insertSubject;
    }

    public updateAccommodation(acc: AccommodationType): Observable<boolean> {
        let updateSubject: Subject<boolean> = new Subject();
        let values = [acc.name, acc.description, acc.coordinates.lat, acc.coordinates.lon, acc.id];
        this._db.executeSql('' +
            'update Accommodations set ' +
            'name = ?, ' +
            'description = ?, ' +
            'lat = ?, ' +
            'lon = ? ' +
            'where id = ?;', values)
            .then((result) => {
                updateSubject.next(result);
                updateSubject.complete();
            })
            .catch((error) => {
                console.log(`Error updating accommodation: '${error}'`);
            });

        return updateSubject;
    }

    public deleteAccommodation(accId: number): Observable<boolean> {
        let deleteSubject: Subject<boolean> = new Subject();
        this._db.executeSql('delete from Accommodations where id = ?', accId)
            .then((result) => {
                deleteSubject.next(result);
                deleteSubject.complete();
            })
            .catch((error) => {
                console.log(`Error deleting accommodation: '${error}'`);
            });

        return deleteSubject;
    }

}

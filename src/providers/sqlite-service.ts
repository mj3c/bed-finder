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
        let accommodationsSubject: Subject<AccommodationType[]> = new Subject();
        if (this._db) {
            this._db.executeSql('select * from Accommodations', [])
                .then((results: SQLResultSet) => {
                    let accommodations: AccommodationType[] = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        let dbAcc: DBAccommodationType = results.rows.item(i);
                        let domainAcc: AccommodationType = this.accommodationDbToDomain(dbAcc);
                        accommodations.push(domainAcc);
                    }
                    accommodationsSubject.next(accommodations);
                    accommodationsSubject.complete();
                })
                .catch((error) => {
                    console.log(`Error fetching accommodations: '${error}'`);
                });
        } else {
            console.log('Database does not exist!');
        }

        return accommodationsSubject;
    }

}

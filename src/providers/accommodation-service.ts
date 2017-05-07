import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SqliteService } from "./sqlite-service";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { LatLng, LatLngBounds } from "@ionic-native/google-maps";

const mockAccommodations: AccommodationType[] = [
    {
        id: 1,
        name: "Two bedroom appartment in the heart of Amsterdam",
        description: "Quiet, clean, nice neighbourhood,reasonable parking, " +
        "Accomodation enjoys good privacy. " +
        "Vondelpark and many restaurants just around the corner. " +
        "Finances go to the Gambia Agricultural Project in Gambia!! " +
        "Supporting 25 people ( information at interest).",
        coordinates: {
            lat: 52.3721825,
            lon: 4.888081
        },
        phone: '+381641234567',
        email: 'example@gmail.com',
        image: ''
    },
    {
        id: 2,
        name: "Single bed dorm",
        description: "Quiet, clean, nice neighbourhood,reasonable parking, " +
        "Accomodation enjoys good privacy. " +
        "Vondelpark and many restaurants just around the corner. " +
        "Finances go to the Gambia Agricultural Project in Gambia!! " +
        "Supporting 25 people ( information at interest).",
        coordinates: {
            lat: 53.3721825,
            lon: 4.888081
        },
        phone: '+381641234567',
        email: 'example@gmail.com',
        image: ''
    },
    {
        id: 3,
        name: "Amstel Botel",
        description: "Quiet, clean, nice neighbourhood,reasonable parking, " +
        "Accomodation enjoys good privacy. " +
        "Vondelpark and many restaurants just around the corner. " +
        "Finances go to the Gambia Agricultural Project in Gambia!! " +
        "Supporting 25 people ( information at interest).",
        coordinates: {
            lat: 52.3721825,
            lon: 5.888081
        },
        phone: '+381641234567',
        email: 'example@gmail.com',
        image: ''
    },
    {
        id: 4,
        name: "Large apartment on the fifth floor",
        description: "Quiet, clean, nice neighbourhood,reasonable parking, " +
        "Accomodation enjoys good privacy. " +
        "Vondelpark and many restaurants just around the corner. " +
        "Finances go to the Gambia Agricultural Project in Gambia!! " +
        "Supporting 25 people ( information at interest).",
        coordinates: {
            lat: 44.3721825,
            lon: 21.888081
        },
        phone: '+381641234567',
        email: 'example@gmail.com',
        image: ''
    },
    {
        id: 5,
        name: "Three room house",
        description: "Quiet, clean, nice neighbourhood,reasonable parking, " +
        "Accomodation enjoys good privacy. " +
        "Vondelpark and many restaurants just around the corner. " +
        "Finances go to the Gambia Agricultural Project in Gambia!! " +
        "Supporting 25 people ( information at interest).",
        coordinates: {
            lat: 43.3721825,
            lon: 21.938081
        },
        phone: '+381641234567',
        email: 'example@gmail.com',
        image: ''
    }
];

export interface AccommodationType {
    id: number;
    name: string;
    description: string;
    coordinates: {
        lat: number;
        lon: number;
    },
    image: string;
    phone: string;
    email: string;
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
                        // if none in databse, insert some mock data
                        if (accs.length === 0) {
                            mockAccommodations.forEach(acc => this.addAccommodation(acc));
                        }
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

    public getMockImageData(): string {
        return 'iVBORw0KGgoAAAANSUhEUgAAAR0AAADFCAYAAABpcCaNAAAABHNCSVQICAgIfAhkiAAADFdJREFUeJzt3etv29QbwPHHSUrHuiFVW8cKdIBAUAkh8Yr//x8Arc3oVnpJW9okzs3N/Wr792Lqfm7WS+zYz3GS70fiDetyjrLtm3McXyzf930BACUZ0xMAsFqIDgBVRAeAKqIDQBXRAaCK6ABQRXQAqCI6AFTlNAZpNBpSKBQ0hgIQ0Zs3b2RrayvxcVSiMx6Ppd1uawwFIKLxeKwyDtsrAKqIDgBVRAeAKqIDQBXRAaCK6ABQRXQAqCI6AFQRHQCqiA4AVUQHgCqiA0AV0QGgiugAUEV0AKgiOgBUER0AqogOAFUqtyuNWyaTkdevX5ueBmCUbdviuq7paYS2sNH55ZdfTE8DMKrRaCxkdNheAVBFdACoIjoAVBEdAKqIDgBVRAeAKqIDQBXRAaCK6ABQRXQAqCI6AFQRHQCqiA4AVUQHgCqiA0AV0QGgiugAUEV0AKgiOgBUER0AqogOAFVEB4AqogNAFdEBoIroAFBFdACoIjoAVBEdAKqIDgBVOdMTWBWDwUDG47Fks1l5+vSp6ekAxhCdBPi+L47jSL1el1qtJsPh8LOfyeVysrm5Ka9evZLNzU3J5fijwGrgb3rMSqWSnJ2d3RmaoMlkItVqVarVqmSzWdnZ2ZGdnR3JZrNKMwXMIDox6Xa7cnBwIN1uN/TvdV1Xzs7OpFgsyq+//iovXrxIYIZAOnAgOQb1el3+/vvvSMEJGo1Gks/n5eLiIqaZAelDdOZk27bk83lxXTe21zw9PZWjo6PYXg9IE6Izh1arJYeHh4m89tXVlRSLxUReGzCJ6EQ0Ho/l3bt34nleYmMcHx9Lq9VK7PUBE4hORBcXFzIajRIdw/M8OTk5SXSMZZbkBwKiIzoRDAYDubq6Uhmr2WxKrVZTGWvZnJ6eSrvdNj0NTCE6ERSLRdVP0f/++09trGVxfX0tV1dXUiqVTE8FU4hOBJVKRXW8Vqsl4/FYdcxF5rquHB4eiu/7Ytt2rN8sYn5EJ6RutyuDwUB1TN/3pVqtqo65yAqFgvT7fRH5GCDbtg3PCEFEJ6Rms2lkXI5NzKbZbH52vI0tVroQnZC0Vzk3bj65cT/P8+TDhw/i+/6t/99utzn1IEWITkiTycTIuBzTeVxwWzWN1U56EB0shVarJZeXl/f+um3bxj4wcBvRCcnUrSfW1taMjLsI7ttWTf8MB5TTgeiE9OWXXxoZd3193ci4i6BQKEiv13v057iWLR2ITkjPnj0zMu7z58+NjJt2j22rgrrdrrFvH/F/RCek58+fG9nqbG5uqo+ZdrNsq6ax2jGP6IRkWZa8fPlSdcyNjQ3Z2NhQHXMRzLqtCqpWq3wTaBjRieC7774Ty7LUxnvz5o3aWIsizLYqiAPK5hGdCDY2NmR7e1tlrGfPnsmrV69UxloUnud9urYqCrZYZhGdiL7//vvEHxtjWZb89NNPqquqRVAoFOa6H3Wv15Pr6+sYZ4QwiE5E6+vr8ttvvyUahB9//JEDyFOibqumcYayOURnDpubm/Lzzz8n8tpff/01x3KmzLutCuKAsjlEZ07ffvut7O7uSiYT31u5s7Mju7u7sb3esjg/P5/7MT83PM+Tcrkcy2shHKITg9evX8sff/whT548met1crmc7O7uchznDu12O/bngXFA2Qye8BmTr776Sv7880+5urqS8/PzUBcXZjIZ2d7elh9++IFrrO4Q5STAWfT7fXEch+NmyohOjDKZjOzs7Mj29rY4jiOVSkUcx7kzQJZlyebmprx48UJevnzJtVUPiHNbNa1YLBIdZUQnAblcTra2tmRra0tEPt4yM3jm7Pr6unzxxRemprdQkthWBdXrdRmNRvx5KCI6CrLZLBdsRpDUtmp6jHK5zDeFijiQvOI6nU5qH0p3cXGR2LYqqFgsJho23EZ0VpjruvLu3bvEH48cRafTSXRbFTQYDMRxHJWxQHRW2vn5uQwGA2k0GvLPP/+kJjw32yrN+fD1uR6is6I6nc6tywnq9XpqwnNxcSGdTkd1zHq9LsPhUHXMVUV0VtTR0dFnganX63JwcGA0PJrbqiDf97keSwnRWUHFYvHe23bWajVj4TGxrQoqlUocUFZAdFbMeDyWQqHw4M+YCo+JbVXQcDiURqNhbPxVQXRWzPHx8UxXV2uHp9vtGtlWTeOAcvKIzgppNpuhbtVZq9Xk/fv3iYfH932j26qgRqNh7NHRq4LorIibe9GEVa1W5f3794ke67i4uJB2u53Y64fh+z63vEgY0VkRl5eXoZ+ccKNarcrBwUEi4el2u3J+fh77686DM5STRXRWQL/fl7Ozs7leI4kVT5q2VUGj0Ujq9brpaSwtorMCjo+PY/mHXalUYg1PmrZV066urkxPYWkRnSVn23asn9qVSiWWK7/TuK0Kur6+ln6/b3oaS4noLDHXdeX09DT217Vte67w+L4vh4eHqdtWBXGGcnKIzhI7OTlJ7HqiecJzeXkprVYrgVnFq1wupzqMi4roLKlOp5P4J7Vt26EfCdPr9R49IzotOKCcDKKzhG6+FdL42rdcLs98/k9av616CGcox4/oLKFSqaR6DVO5XJYPHz48+nOLsq0KchyHA8oxIzpLZjgcysnJifq4j614FmlbNY3VTryITsK0txKnp6fiuq7qmDdKpdKd4VnEbVUQB5TjRXQS5DiO6v2H6/V6qAs6k3BXeBZxWxU0Ho+lWq2ansbSIDoJKhQK0mg0JJ/PJx4ez/Pk+Pg40TFmVSqV5N9//xWRj5dgLOq2KogtVnx47lVCHMf59OnuOI7k83n5/fffJZNJpvNnZ2epOuB58480zY+4CaPZbEqv15OnT5+ansrCY6WTkOlPd8dxZH9/P5F/gL1e79ZN1tOiWCwu9LZqGqudeBCdBARXOUHX19eyt7cX+4HetF9SsCxs2+Z9jgHRScBDxzCazabs7+/HFh7btu+9yTriNR6PpVKpmJ7GwiM6MbtvlRPUbDZlb29PJpPJXGONx+PUHDxeFWyx5kd0YjbrNzWtVkv29/fnCk+hUJjpJuuIT6vVUnm++jIjOjGaZZUT1Gq1Iq94ms0mn7qGcIOv+RCdGEU5H6Xdbsve3l6oFYvneXJ0dBR6LMSjUqkYO+t7GRCdmIRd5QSFDc/l5aXRh9KtuslkwgHlORCdmMx71m2n05kpPIPBINW3+VwV3FUwOqITg3lWOUGdTkfevn37YHiOjo5Y2qdAq9VK7U3l047oxCDOa4u63a68fftWRqPRZ79Wq9W4k12KsNqJhujMKa5VTlC325W9vb1b4XFdl4PHKWPbNqvOCIjOnJK6gvpmxXNzY/Wzs7PEbrKOaFzXNX4rkUVEdOaQxConqNfryd7entTr9VRe0AnOUI6C6MxB4z4xvV5P8vk8z9ZOqU6ns1RX0msgOhElvcrB4mC1Ew7RiWgZ7oaHeFQqlbkv3l0lRCcCVjkI8jyPA8ohEJ0IWOVgGlus2RGdkFjl4C7dbpebqc2I6ITEKgf3YbUzG6ITAqscPKRarXJTtRkQnRBY5eAhnudJuVw2PY3UIzozYpWDWXAR6OOIzoxY5WAWvV5PHMcxPY1UIzozYJWDMNhiPYzozIBVDsLggPLDiM4jWOUgLA4oP4zoPIJVDqLgnJ37EZ0HsMpBVP1+nwPK9yA6D2CVg3mw2rkb0bkHqxzMq1ar3XmD/VVHdO7BKgfz8n2fkwXvQHTuwCoHcSmVStxqdkrO9ATSqN/vyzfffGN6GlgSw+FQnjx5YnoaqUF07kBwgOSwvQKgiugAUEV0AKgiOgBUER0AqogOAFVEB4AqogNAFdEBoIroAFBFdACoIjoAVBEdAKqIDgBVRAeAKqIDQBXRAaCK6ABQtZC3K/V9X9rttulpAEZ5nmd6CpEsZHRc15W//vrL9DQARMD2CoAqogNAFdEBoIroAFBFdACoIjoAVBEdAKqIDgBVRAeAKqIDQBXRAaCK6ABQRXQAqCI6AFQRHQCqLN/3fdOTALA6WOkAUEV0AKgiOgBUER0AqogOAFVEB4AqogNAlcpzr3zfF8uy5n6d0WgkuVxOMpnlaOWsp0jd/JxlWbd+z817Gnx/p9/r8XgslmXJZDKRXO7jH7frurK2tiaj0Ugsy5K1tTXxfV8mk4lks1nJ5XK3xvI877P3/L4/T9/3P3sInGVZ4rquZLNZsSzr02vf/Bd87bv+rtz8TFx/j5ad53mf3uf7mHwv/weZWLhZvBDbKwAAAABJRU5ErkJggg==';
    }
}

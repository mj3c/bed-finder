import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FilterService, SearchTerms } from "../../providers/filter-service";
import { MapPage } from "../map/map";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild('logo')
    private _logoEl: ElementRef;
    public searchArea: string = '';
    public searchInfo: string = '';

    constructor(public navCtrl: NavController, private _filterService: FilterService) {

    }

    ionViewDidLoad() {
        this.drawLogo();
    }

    search() {
        let terms: SearchTerms = {
            area: this.searchArea.trim().toLowerCase(),
            info: this.searchInfo.trim().toLowerCase(),
            coords: null
        };
        this._filterService.setTerms(terms);
        this.navCtrl.push(MapPage, {
            data: {
                terms: terms
            }
        });
    }

    drawLogo() {
        let context = this._logoEl.nativeElement.getContext('2d');

        let blue: string = '#324A5E';
        let red: string = '#FF5A60';
        let yellow: string = '#FFD05B';
        let white: string = '#FFFFFF';

        // circle
        context.fillStyle = red;
        context.beginPath();
        context.arc(75, 75, 75, 0, 2*Math.PI);
        context.fill();

        // lower wood part
        context.fillStyle = blue;
        context.beginPath();
        context.moveTo(20, 80);
        context.lineTo(20, 110);
        context.lineTo(25, 110);
        context.lineTo(30, 105);
        context.lineTo(120, 105);
        context.lineTo(125, 110);
        context.lineTo(130, 110);
        context.lineTo(130, 80);
        context.fill();

        // upper wood part
        context.beginPath();
        context.moveTo(35, 30);
        context.lineTo(35, 60);
        context.lineTo(115, 60);
        context.lineTo(115, 30);
        context.fill();

        // left pillow
        context.fillStyle = yellow;
        context.beginPath();
        context.moveTo(42, 60);
        context.lineTo(65, 60);
        context.lineTo(65, 50);
        context.lineTo(42, 50);
        context.fill();

        // right pillow
        context.beginPath();
        context.moveTo(108, 60);
        context.lineTo(85, 60);
        context.lineTo(85, 50);
        context.lineTo(108, 50);
        context.fill();

        // sheets
        context.fillStyle = white;
        context.beginPath();
        context.moveTo(25, 80);
        context.lineTo(125, 80);
        context.lineTo(115, 60);
        context.lineTo(35, 60);
        context.fill();
    }

}

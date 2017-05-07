import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActionSheetController, NavController, NavParams } from 'ionic-angular';

import { AccommodationPage } from '../accommodation/accommodation';
import { AccommodationType, AccommodationService } from '../../providers/accommodation-service';
import { EditAccommodationPage } from "../edit-accommodation/edit-accommodation";
import { SharingService } from "../../providers/sharing-service";

@Component({
    selector: 'page-accommodations',
    templateUrl: 'accommodations.html',
})
export class AccommodationsPage {
    @ViewChild('imageshare')
    private _imageShareEl: ElementRef;
    public accommodations: AccommodationType[];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private _actionSheetCtrl: ActionSheetController,
                private _accommodationService: AccommodationService,
                private _sharingService: SharingService
    ) {
        this._accommodationService.accommodationsSubject
            .subscribe(accs => {
                this.accommodations = accs;
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Accommodations');
    }

    accommodationClicked(acc: AccommodationType): void {
        this.navCtrl.push(AccommodationPage, {
            data: {
                id: acc.id,
                name: acc.name,
                description: acc.description,
                coordinates: acc.coordinates
            }
        });
    }

    accommodationPressed(acc: AccommodationType): void {
        this.navCtrl.push(EditAccommodationPage, {
            data: {
                id: acc.id,
                name: acc.name,
                description: acc.description,
                coordinates: acc.coordinates
            }
        });
    }

    newAccommodation(): void {
        this.navCtrl.push(EditAccommodationPage, {
            data: {}
        });
    }

    shareClicked(acc): void {
        let nameFontSize: number = 72,
            descFontSize = 24,
            startPos: any = { x: 100, y: 150 },
            curPos: any = startPos,
            canvasEl: any = document.getElementById('imageshare'),
            context: CanvasRenderingContext2D = this._imageShareEl.nativeElement.getContext('2d'),
            image: HTMLImageElement = new Image();

        image.onload = () => {
            context.drawImage(image, 0, curPos.y);
            let jpegUrl: string = canvasEl.toDataURL('image/jpeg', 1.0);
            this._sharingService.share(jpegUrl);
        };

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvasEl.width, canvasEl.height);

        context.fillStyle = 'black';
        context.font = `${nameFontSize}px Arial`;
        let nameLines: string[] = this.getLines(context, acc.name, canvasEl.width - 2 * startPos.x);
        for (let i = 0; i < nameLines.length; i++) {
            context.fillText(nameLines[i], curPos.x, curPos.y);
            curPos.y += nameFontSize;
        }
        curPos.y += 50;

        context.font = `${descFontSize}px Arial`;
        let descLines: string[] = this.getLines(context, acc.description, canvasEl.width - 2 * startPos.x);
        for (let i = 0; i < descLines.length; i++) {
            context.fillText(descLines[i], curPos.x, curPos.y);
            curPos.y += descFontSize;
        }
        curPos.y += 30;

        context.fillText(`Phone: ${acc.phone}`, curPos.x, curPos.y);
        curPos.y += 20;
        context.fillText(`Email: ${acc.email}`, curPos.x, curPos.y);
        curPos.y += 50;

        image.src = `data:image/jpeg;base64,${acc.image}`;
    }

    private getLines(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
        let words: string[] = text.split(" ");
        let lines: string[] = [];
        let currentLine: string = words[0];

        for (let i = 1; i < words.length; i++) {
            let word: string = words[i];
            let width: number = context.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

}

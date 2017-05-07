import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MapPage } from '../pages/map/map';
import { AccommodationsPage } from "../pages/accommodations/accommodations";

import { AccommodationService } from "../providers/accommodation-service";
import { GeolocationService } from "../providers/geolocation-service";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EditAccommodationPage } from "../pages/edit-accommodation/edit-accommodation";
import { SqliteService } from "../providers/sqlite-service";
import { PictureService } from "../providers/picture-service";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { SharingService } from "../providers/sharing-service";
import { FilterService } from "../providers/filter-service";
import { CallNumber } from "@ionic-native/call-number";
import { EmailComposer } from "@ionic-native/email-composer";

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        MapPage,
        AccommodationsPage,
        EditAccommodationPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicImageViewerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        MapPage,
        AccommodationsPage,
        EditAccommodationPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AccommodationService,
        GeolocationService,
        SqliteService,
        PictureService,
        SharingService,
        FilterService,
        CallNumber,
        EmailComposer
    ]
})
export class AppModule {
}

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SocialSharing } from "@ionic-native/social-sharing";

@Injectable()
export class SharingService {
    private _socialSharing: SocialSharing = new SocialSharing;

    public share(jpegUrl: string): void {
        this._socialSharing.share(null, null, jpegUrl, null);
    }
}

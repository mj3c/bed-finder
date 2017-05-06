import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SocialSharing } from "@ionic-native/social-sharing";
import { AccommodationType } from "./accommodation-service";

@Injectable()
export class SharingService {
    private _socialSharing: SocialSharing = new SocialSharing;

    public share(acc: AccommodationType): void {
        this._socialSharing.share("message", "subject", `data:image/png;base64,${acc.image}`, null);
    }
}

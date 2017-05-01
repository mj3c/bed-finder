import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from "@ionic-native/camera";

export enum PictureSource {
    CAMERA,
    GALLERY
}

@Injectable()
export class PictureService {
    private _camera = new Camera();

    public getPicture(source: PictureSource): Promise<string> {
        let camOptions: CameraOptions = {
            quality: 100,
            destinationType: this._camera.DestinationType.DATA_URL,
            encodingType: this._camera.EncodingType.JPEG,
            mediaType: this._camera.MediaType.PICTURE,
            sourceType: (source === PictureSource.CAMERA)
                ? this._camera.PictureSourceType.CAMERA
                : this._camera.PictureSourceType.PHOTOLIBRARY
        };

        return new Promise((resolve, reject) => {
            this._camera.getPicture(camOptions)
                .then(imageData => resolve(imageData))
                .catch(err => reject(err));
        });
    }
}

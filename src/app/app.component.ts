import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TGHAsset, TGHLatestVersion } from 'src/models/github.model';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    latestVersion?: TGHLatestVersion;
    exeAsset?: TGHAsset;
    images: { src: string; alt: string }[];
    imagesSliderOptions: {
        breakpoint: string;
        numVisible: number;
        numScroll: number;
    }[];
    showImage: boolean;
    selectedImage?: { src: string; alt: string };

    constructor(private _primengConfig: PrimeNGConfig, private _http: HttpClient) {
        this.images = [
            { src: 'https://i.imgur.com/asBZIfP.png', alt: 'Landing page (BeatSaver)' },
            { src: 'https://i.imgur.com/uJoY8VJ.png', alt: 'Installed songs (Local)' },
            { src: 'https://i.imgur.com/KyUjo4w.png', alt: 'Song card (collapsed)' },
            { src: 'https://i.imgur.com/WNKqBPP.png', alt: 'Song card (expanded)' },
            { src: 'https://i.imgur.com/gaVon8i.png', alt: 'Song detail page' },
            { src: 'https://i.imgur.com/wnpQpzt.png', alt: 'Download queue' },
            { src: 'https://i.imgur.com/luAHQ6C.png', alt: 'Settings' }
        ];
        this.imagesSliderOptions = [
            {
                breakpoint: '1024px',
                numVisible: 4,
                numScroll: 1
            },
            {
                breakpoint: '960px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
            }
        ];
        this.showImage = false;
    }

    ngOnInit() {
        this._primengConfig.ripple = true;
        this._loadLatestVersion().subscribe();
    }

    onImageOpen(info: { src: string; alt: string }) {
        this.selectedImage = info;
        this.showImage = true;
    }

    private _loadLatestVersion(): Observable<TGHLatestVersion> {
        return this._http
            .get<TGHLatestVersion>(
                'https://api.github.com/repos/dotMortis/beat-saver-client/releases/latest'
            )
            .pipe(
                tap((result: TGHLatestVersion) => {
                    this.latestVersion = result;
                    this.exeAsset = result.assets.find((asset: TGHAsset) =>
                        asset.name.match(
                            /^BeatSaverClient-v[0-9]+\.[0-9]+\.[0-9]+(-beta|-alpha)?-Installer\.exe$/i
                        )
                    );
                })
            );
    }
}

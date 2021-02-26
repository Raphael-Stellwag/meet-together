import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class LoadingScreenService {
    private _loading: boolean = false;
    private loading_message: string;
    private _loadingStatus: Subject<boolean> = new Subject();

    get loadingStatus(): Subject<boolean> {
        return this._loadingStatus;
    }

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
        this.loadingStatus.next(value);
    }

    getMessage(): any {
        return this.loading_message;    
    }

    startLoading(loading_message: string) {
        this.loading_message = loading_message;
        this.loading = true;
    }

    stopLoading() {
        this.loading = false;
    }
}

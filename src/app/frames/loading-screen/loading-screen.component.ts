import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { LoadingScreenService } from "./loading-screen.service";

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {

    loading: boolean = false;
    loadingSubscription: Subscription;
    message: string;

    constructor(private loadingScreenService: LoadingScreenService) {
    }

    ngOnInit() {
        this.loadingSubscription = this.loadingScreenService.loadingStatus.subscribe((value: boolean) => {
            if (value) {
                this.message = this.loadingScreenService.getMessage()
            }
            this.loading = value;
        });
    }

    AfterViewInit() {
        console.log("After View init callede");
    }

    ngOnDestroy() {
        this.loadingSubscription.unsubscribe();
    }

}

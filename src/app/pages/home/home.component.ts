import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { TopBarComponent } from 'src/app/frames/top-bar/top-bar.component';
import { IEvent } from 'src/app/interfaces/ievent';
import { AddEventButtonComponent } from 'src/app/frames/add-event-button/add-event-button.component';
import { HelperFunctionsService } from 'src/app/services/helper-functions.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit{

  @ViewChild(TopBarComponent) topBarComponent: TopBarComponent;
  @ViewChild(AddEventButtonComponent) addJoinButton: AddEventButtonComponent;

  events: IEvent[] = [];

  constructor(public helperFunctions: HelperFunctionsService, private route: ActivatedRoute) {
    console.log("constructor of home called");
  }

  ngOnInit() {
    console.log("ngOnInit of home called");
    this.events = this.route.snapshot.data.eventData;
  }

  ngAfterViewInit() {
    if (this.events.length == 0) {
      this.addJoinButton.showToolTip();
    }
  }
}

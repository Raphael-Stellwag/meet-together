import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NewUserDialog } from 'src/app/dialogs/new-user-dialog/new-user-dialog.component';
import { TopBarComponent } from 'src/app/frames/top-bar/top-bar.component';
import { IEvent } from 'src/app/interfaces/ievent';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { AddEventButtonComponent } from 'src/app/frames/add-event-button/add-event-button.component';
import { HelperFunctionsService } from 'src/app/services/helper-functions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  checked: boolean = false;
  disabled: boolean = false;
  color: string = "primary";
  @ViewChild(TopBarComponent) topBarComponent: TopBarComponent;
  @ViewChild(AddEventButtonComponent) addJoinButton: AddEventButtonComponent;

  events: IEvent[] = [];

  constructor(public dialog: MatDialog, private userService: UserService, private eventSerivce: EventService, public helperFunctions: HelperFunctionsService) { 
    console.log("constructor of home called");
  }

  async ngOnInit() {
    console.log("ngOnInit of home called");
    this.events = await this.eventSerivce.getEvents();
    if (this.events.length == 0) {
      this.addJoinButton.showToolTip();
    }
  }
}

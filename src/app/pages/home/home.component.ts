import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NewUserDialog } from 'src/app/dialogs/new-user-dialog/new-user-dialog.component';
import { TopBarComponent } from 'src/app/frames/top-bar/top-bar.component';
import { IEvent } from 'src/app/interfaces/ievent';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { AddEventButtonComponent } from 'src/app/frames/add-event-button/add-event-button.component';
import { OutputWriterService } from 'src/app/services/output-writer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  title = 'meet-together-client';

  checked: boolean = false;
  disabled: boolean = false;
  color: String = "primary";
  @ViewChild(TopBarComponent) topBarComponent: TopBarComponent;
  @ViewChild(AddEventButtonComponent) addJoinButton: AddEventButtonComponent;

  events: IEvent[] = [];

  constructor(public dialog: MatDialog, private userService: UserService, private eventSerivce: EventService, public outputWriter: OutputWriterService) { }

  ngOnInit() {
    if (this.userService.getUserName() != null) {
      this.eventSerivce.getEvents()
        .then((events: IEvent[]) => this.events = events)
    } else {
      let _this = this
      setTimeout(() => {
        const dialogRef = this.dialog.open(NewUserDialog);

        dialogRef.afterClosed().subscribe(userName => {
          console.log(userName);
          _this.addJoinButton.showToolTip();
          this.userService.createUserName(userName).then(() => {
            _this.topBarComponent.userMenu.updateUserName();
            this.eventSerivce.getEvents()
              .then((events: IEvent[]) => this.events = events)

          });
        });
      })
    }
    //this.listenForChanges();
  }

  ngAfterViewInit() {
    console.log(this.topBarComponent);
    if (this.userService.getUserName() == null) {

    }
  }

  /*
  listenForChanges() {
    this.eventSerivce.notifyWhenChanged()
      .then((events: IEvent[]) => {
        this.events = events;
        this.listenForChanges();
      })
  }
  */

  eventAdded(event) {
    //this.eventSerivce.getEvents()
    //  .then((events: IEvent[]) => this.events = events);
    //this.events.push(event);
  }
}

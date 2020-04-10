import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NewUserDialog } from 'src/app/dialogs/new-user-dialog/new-user-dialog.component';
import { TopBarComponent } from 'src/app/frames/top-bar/top-bar.component';
import { IEvent } from 'src/app/interfacese/ievent';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';

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
  events: IEvent[];

  constructor(public dialog: MatDialog, private userService: UserService, private eventSerivce: EventService) { }

  ngOnInit() {
    this.events = this.eventSerivce.getEvents();
    this.listenForChanges();
  }

  ngAfterViewInit() {
    console.log(this.topBarComponent);
    let _this = this
    if (this.userService.getUserName() == null) {
      setTimeout(() => {
        const dialogRef = this.dialog.open(NewUserDialog);

        dialogRef.afterClosed().subscribe(userName => {
          console.log('The dialog was closed');
          this.userService.createUserName(userName).then(() => _this.topBarComponent.userMenu.updateUserName());
          console.log(userName);
        });
      })
    }
  }

  listenForChanges() {
    this.eventSerivce.notifyWhenChanged()
      .then((events: IEvent[]) => {
        this.events = events;
        this.listenForChanges();
      })
  }

  printDate(date: Date) {
    console.log(date.toLocaleString());
    console.log(date.toLocaleTimeString("de", { hour: '2-digit', minute: '2-digit' }));
    console.log(date);
    return date.toLocaleDateString("de") + " " + date.toLocaleTimeString("de", { hour: '2-digit', minute: '2-digit' });
  }
}

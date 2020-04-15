import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { NewUserDialog } from 'src/app/dialogs/new-user-dialog/new-user-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-join-event',
  templateUrl: './join-event.component.html',
  styleUrls: ['./join-event.component.scss']
})
export class JoinEventComponent implements AfterViewInit {

  constructor(private router: Router, private actRoute: ActivatedRoute, private userService: UserService, private eventService: EventService, private matDialog: MatDialog) {
    let event_id = this.actRoute.snapshot.params.id;
    let access_token = this.actRoute.snapshot.queryParams.accesstoken;
    console.log("Event View initialised");
    if (this.userService.getUserId() != null) {
      this.addEvent(event_id, access_token);
    } else {
      const dialogRef = this.matDialog.open(NewUserDialog);

      dialogRef.afterClosed().subscribe(userName => {
        console.log('The dialog was closed');
        this.userService.createUserName(userName).then(() => this.addEvent(event_id, access_token));
        console.log(userName);
      });
    }
  }

  ngAfterViewInit(): void {
    //if (this.userService.getUserId() == null) {
    //TODO show welcome dialog
    //}
  }

  addEvent(event_id, accesstoken) {
    this.eventService.joinEvent(event_id, accesstoken).then(() => {
      const dialogRef = this.matDialog.open(MessageDialogComponent, {
        data: {
          error: false,
          message: "You have successfully joined the event!!!"
        }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/home']);
      })
    }).catch((errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      const dialogRef = this.matDialog.open(MessageDialogComponent, {
        data: {
          error: true,
          message: errorResponse.error.message
        }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/home']);
      })
    })
  }

}

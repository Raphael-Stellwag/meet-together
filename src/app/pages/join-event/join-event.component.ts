import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-join-event',
  templateUrl: './join-event.component.html',
  styleUrls: ['./join-event.component.scss']
})
export class JoinEventComponent {

  constructor(private router: Router, private actRoute: ActivatedRoute, private userService: UserService, private eventService: EventService, private matDialog: MatDialog) {
    let event_id = this.actRoute.snapshot.params.id;
    let access_token = this.actRoute.snapshot.queryParams.accesstoken;
    this.addEvent(event_id, access_token);
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
      console.warn(errorResponse);
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

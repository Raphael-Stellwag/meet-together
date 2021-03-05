import { Component, NgZone } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/interfaces/iuser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateUserNameDialog } from 'src/app/dialogs/update-user-name-dialog/update-user-name-dialog.component';
import { EventService } from 'src/app/services/event.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Router } from '@angular/router';
import { LoginDialog } from 'src/app/dialogs/login-dialog/login-dialog.component';
import { RegisterDialog } from 'src/app/dialogs/register-dialog/register-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  public user: IUser;

  constructor(private snackBar: MatSnackBar, private zone: NgZone, private userService: UserService, private router: Router, private dialog: MatDialog, private eventService: EventService, private messageService: MessagesService) {
    this.updateUserName();
  }

  updateUserName(): void {
    this.user = this.userService.getUser()
  }

  async renameUser() {
    let dialogRef: MatDialogRef<UpdateUserNameDialog> = this.dialog.open(UpdateUserNameDialog, { data: { name: this.user.name } });
    let successful: boolean = await dialogRef.afterClosed().toPromise();
    if (successful) {
      let config = new MatSnackBarConfig();
      config.duration = 5000;
      this.snackBar.open('User name successfully changed', null, config);
    }
  }

  async login() {
    let dialogRef: MatDialogRef<LoginDialog> = this.dialog.open(LoginDialog, { data: { user: this.user } });
    let successful: boolean = await dialogRef.afterClosed().toPromise();
    if (successful) {
      this.eventService.logout();
      this.messageService.logout();
      this.zone.runOutsideAngular(() => {
        location.reload();
      });
    }
  }

  logout() {
    this.userService.logout();
    this.eventService.logout();
    this.messageService.logout();
    this.zone.runOutsideAngular(() => {
      location.reload();
    });
  }

  async register() {
    let dialogRef: MatDialogRef<RegisterDialog> = this.dialog.open(RegisterDialog, { data: { user: this.user } });
    let successful: boolean = await dialogRef.afterClosed().toPromise();
    if (successful) {
      let config = new MatSnackBarConfig();
      config.duration = 5000;
      this.snackBar.open('Sign up was successfull, dont forget your password', null, config);
    }

  }
}

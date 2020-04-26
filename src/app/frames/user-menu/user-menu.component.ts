import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/interfaces/iuser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateUserNameDialog } from 'src/app/dialogs/update-user-name-dialog/update-user-name-dialog.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  public user: IUser;

  constructor(private userService: UserService, private dialog: MatDialog) {
    this.updateUserName();
  }

  updateUserName(): void {
    this.user = this.userService.getUser()
  }

  renameUser() {
    let dialogRef: MatDialogRef<UpdateUserNameDialog> = this.dialog.open(UpdateUserNameDialog, { data: { name: this.user.name } });
    dialogRef.afterClosed().toPromise().then((username: String) => {
      this.userService.renameUser(username);
    })
  }

}

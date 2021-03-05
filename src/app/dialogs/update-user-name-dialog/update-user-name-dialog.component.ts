import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-update-user-name-dialog',
  templateUrl: './update-user-name-dialog.component.html',
  styleUrls: ['./update-user-name-dialog.component.scss']
})
export class UpdateUserNameDialog implements OnInit {
  username: string = "";

  constructor(private dialog: MatDialog, private userService: UserService, private dialogRef: MatDialogRef<UpdateUserNameDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.username = data.name;
  }

  ngOnInit(): void {
  }

  async close() {
    if (this.username != "") {
      try {
        await this.userService.renameUser(this.username)
        this.dialogRef.close(true);
      } catch(e) {
        this.dialog.open(MessageDialogComponent, {
          data: {
            error: true,
            message: "Username couldnt be changed, try it later again"
          }
        })
      }
    }
  }
}

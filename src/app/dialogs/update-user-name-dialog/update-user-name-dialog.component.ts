import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user-name-dialog',
  templateUrl: './update-user-name-dialog.component.html',
  styleUrls: ['./update-user-name-dialog.component.scss']
})
export class UpdateUserNameDialog implements OnInit {
  username: String = "";

  constructor(private dialogRef: MatDialogRef<UpdateUserNameDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.username = data.name;
  }

  ngOnInit(): void {
  }

  close() {
    if (this.username != "") {
      this.dialogRef.close(this.username);
    }
  }
}

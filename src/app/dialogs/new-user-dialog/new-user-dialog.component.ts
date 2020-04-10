import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss']
})
export class NewUserDialog implements OnInit {
  username: String = "";

  constructor(private dialogRef: MatDialogRef<NewUserDialog>){
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  close() {
    if (this.username!= "") {
      this.dialogRef.close(this.username);
    }
  }

}

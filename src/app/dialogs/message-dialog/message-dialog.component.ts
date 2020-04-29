import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {
  message: boolean;
  error;

  constructor(private dialogRef: MatDialogRef<MessageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.error = data.error;
    this.message = data.message;
  }

  ngOnInit(): void {
  }

  closeMe() {
    this.dialogRef.close();
  }

}

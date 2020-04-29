import { Component, OnInit, Inject } from '@angular/core';
import { IUser } from 'src/app/interfaces/iuser';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialog {
  myForm: FormGroup;
  yetRegistered: boolean;

  constructor(private dialog: MatDialog, private userService: UserService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<LoginDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.yetRegistered = data.user.registered;
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  login() {
    if (this.myForm.valid) {
      this.userService.loginUser(this.myForm.get("email").value, this.myForm.get("password").value)
        .then(() => {
          this.dialogRef.close(true);
        })
        .catch((error) => {
          console.log(error.error.message);
          const dialogRef = this.dialog.open(MessageDialogComponent, {
            data: {
              error: true,
              message: error.error.message
            }
          });
        })
    }
  }

  /* Handle form errors in Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  }
}

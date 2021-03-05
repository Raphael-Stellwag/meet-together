import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HelperFunctionsService } from 'src/app/services/helper-functions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialog implements OnInit {
  myForm: FormGroup;

  constructor(private dialog: MatDialog, private userService: UserService, private helperFunctions: HelperFunctionsService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<RegisterDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.myForm = this.formBuilder.group({
      name: [data.user.name, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  ngOnInit(): void {
  }

  register() {
    if (this.myForm.valid) {
      this.userService.registerUser(this.myForm.get("name").value, this.myForm.get("email").value, this.myForm.get("password").value)
        .then(() => {
          this.dialogRef.close(true);
        })
        .catch((error) => {
          console.warn(error.error.message);
          this.dialog.open(MessageDialogComponent, {
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

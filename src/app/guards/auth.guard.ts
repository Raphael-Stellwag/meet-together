import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NewUserDialog } from '../dialogs/new-user-dialog/new-user-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router,
    public matDialog: MatDialog,
    public userService: UserService,
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    if (this.authService.isLoggedIn() !== true) {
      const dialogRef = this.matDialog.open(NewUserDialog);

      let userName = await dialogRef.afterClosed().toPromise();
      await this.userService.createUserName(userName);
      await this.router.navigate([state.url]);
    }

    return true;
  }

}

import { LoadingScreenService } from './../frames/loading-screen/loading-screen.service';
import { StorageService } from './../services/storage.service';
import { ConnectionService } from './../services/connection.service';
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
    public connectionService: ConnectionService,
    public storageService: StorageService,
    public loadingScreenService: LoadingScreenService
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    let last_backend_call: Date = this.storageService.getLastBackendCall();
    if (last_backend_call == null || this.dateOlderThan30Minutes(last_backend_call)) {

      let test_connection_finished = false;
      let progress_spinner_started = false;
      setTimeout(() => {
        if (test_connection_finished == false) {
          progress_spinner_started = true;
          this.loadingScreenService.startLoading("Backend is starting at the moment. This can take up to 20 seconds");
        }
      }, 500);
      
      await this.connectionService.testConnection();

      test_connection_finished = true;
      setTimeout(() => {
        if (progress_spinner_started == true) {
          this.loadingScreenService.stopLoading();
        }
      }, 500);

      this.storageService.setLastBackendCall(new Date());
    }
    
    if (this.authService.isLoggedIn() !== true) {
      const dialogRef = this.matDialog.open(NewUserDialog);

      let userName = await dialogRef.afterClosed().toPromise();
      await this.userService.createUserName(userName);
      this.router.navigate([state.url]);
    } 
    
    return true; 
  }

  /**
   * Calculates if the given date is oler than 30 minutes -> important for Heroku
   * @param date last Access Date from the server
   */
  private dateOlderThan30Minutes(date: Date) {
    let current = new Date();
    if ((current.getTime()-date.getTime()) > 1000*60*30) {
      return true;
    }
    return false;
  }

}
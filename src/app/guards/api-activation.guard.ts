import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {ConnectionService} from "../services/connection.service";
import {StorageService} from "../services/storage.service";
import {LoadingScreenService} from "../frames/loading-screen/loading-screen.service";

@Injectable({
  providedIn: 'root'
})
export class ApiActivationGuard implements CanActivate {

  constructor(
    public connectionService: ConnectionService,
    public storageService: StorageService,
    public loadingScreenService: LoadingScreenService
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    let last_backend_call: Date = this.storageService.getLastBackendCall();
    if (last_backend_call == null || ApiActivationGuard.dateOlderThan30Minutes(last_backend_call)) {

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

    return true;
  }


  /**
   * Calculates if the given date is oler than 30 minutes -> important for Heroku
   * @param date last Access Date from the server
   */
  private static dateOlderThan30Minutes(date: Date) {
    let current = new Date();
    return (current.getTime() - date.getTime()) > 1000 * 60 * 30;
  }
}

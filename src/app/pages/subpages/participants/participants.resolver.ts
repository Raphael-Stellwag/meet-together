import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {EMPTY, Observable} from "rxjs";
import {ParticipantsService} from "../../../services/participants.service";


@Injectable({
  providedIn: 'root'
})
export class ParticipantsResolver implements Resolve<Promise<any[]>> {

  constructor(private participantsService: ParticipantsService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<any[]> | Observable<any> {

    let event_id = route.paramMap.get("id");
    if (event_id == null) {
      this.router.navigate(['home']);
      return EMPTY;
    }

    return this.participantsService.getParticipants(event_id);
  }
}

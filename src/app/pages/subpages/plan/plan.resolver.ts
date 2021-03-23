import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {MessagesService} from "../../../services/messages.service";
import {IMessage} from "../../../interfaces/imessage";
import {EMPTY, Observable} from "rxjs";
import {TimePlaceSuggestionService} from "../../../services/time-place-suggestion.service";


@Injectable({
  providedIn: 'root'
})
export class PlanResolver implements Resolve<Promise<any[]>> {

  constructor(private timePlaceSuggestionService: TimePlaceSuggestionService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<any[]> | Observable<any> {

    let event_id = route.paramMap.get("id");
    if (event_id == null) {
      this.router.navigate(['home']);
      return EMPTY;
    }

    return this.timePlaceSuggestionService.getTimePlaceSuggestions(event_id);

  }
}

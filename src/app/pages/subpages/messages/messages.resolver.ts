import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {MessagesService} from "../../../services/messages.service";
import {IMessage} from "../../../interfaces/imessage";
import {EMPTY, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MessagesResolver implements Resolve<Promise<IMessage[]>> {

  constructor(private messagesService: MessagesService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<IMessage[]> | Observable<any> {
    let event_id = route.paramMap.get("id");
    if (event_id == null) {
      this.router.navigate(['home']);
      return EMPTY;
    }
    return this.messagesService.getMessages(event_id);
  }
}

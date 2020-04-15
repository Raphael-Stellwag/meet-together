import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { EventComponent } from '../../event/event.component';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  accessUrl = "";

  constructor(private actRoute: ActivatedRoute, private eventService: EventService) {

  }

  ngOnInit(): void {
    let event_id;
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      console.log(element);
      if (element.params.id != undefined && element.params.id != null) {
        console.log(element.params.id);
        event_id = element.params.id;
      }
    })
    console.log(event_id)
    this.eventService.getEvent(event_id).then((event) => {
      this.accessUrl = window.location.protocol + "//" + window.location.host + "/join-event/" + event_id + "?accesstoken=" + event.accesstoken;
    })
  }

}

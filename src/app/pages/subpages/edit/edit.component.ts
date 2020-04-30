import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { IEvent } from 'src/app/interfaces/ievent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventComponent } from '../../event/event.component';
import { ITimePlaceSuggestion } from 'src/app/interfaces/itime-place-suggestion';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

  updateButtonPressed(data) {
    if (data.timePlaceSuggestion != null) {
      console.error("Should be null: ", data.timePlaceSuggestion);
    }
    this.eventService.updateEvent(data.event)
      .catch(error => console.error(error));
  }

}

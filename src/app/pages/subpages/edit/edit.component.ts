import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';

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

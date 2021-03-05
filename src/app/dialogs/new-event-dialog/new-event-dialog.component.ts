import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IEvent } from 'src/app/interfaces/ievent';
import { EventService } from 'src/app/services/event.service';
import { CreateEditEventComponent } from 'src/app/frames/create-edit-event/create-edit-event.component';
import { TimePlaceSuggestionService } from 'src/app/services/time-place-suggestion.service';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialog {
  @ViewChild(CreateEditEventComponent) createEventComponent;

  constructor(private dialogRef: MatDialogRef<NewEventDialog>, private eventService: EventService, private timePlaceSuggestionService: TimePlaceSuggestionService) { }

  async createButtonPressed(data) {
    let event: IEvent = await this.eventService.addEvent(data.event);

    if (data.timePlaceSuggestion == null) {
      this.dialogRef.close(event);
    } else {
      await this.timePlaceSuggestionService.createTimePlaceSuggestion(event.id, data.timePlaceSuggestion)
      this.dialogRef.close(event);
    }
  }
}

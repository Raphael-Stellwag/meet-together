import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IEvent } from 'src/app/interfaces/ievent';
import { EventService } from 'src/app/services/event.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateEditEventComponent } from 'src/app/frames/create-edit-event/create-edit-event.component';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialog implements OnInit {
  @ViewChild(CreateEditEventComponent) createEventComponent;

  constructor(private dialogRef: MatDialogRef<NewEventDialog>, private eventService: EventService) { }

  ngOnInit(): void {
  }

  createButtonPressed(data) {
    console.log(data);
    this.eventService.addEvent(data.event)
      .then((event: IEvent) => {
        if (data.timePlaceSuggestion == null) {
          this.dialogRef.close(event);
        } else {
          this.eventService.createTimePlaceSuggestion(event.id, data.timePlaceSuggestion)
            .then(() => {
              this.dialogRef.close(event);
            })
        }
      })
      .catch(error => console.log(error));
  }
}

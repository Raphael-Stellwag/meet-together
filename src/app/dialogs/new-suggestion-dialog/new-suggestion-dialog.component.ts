import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import { ITimePlaceSuggestion } from 'src/app/interfaces/itime-place-suggestion';
import { CreateSuggestionComponent } from 'src/app/frames/create-suggestion/create-suggestion.component';

@Component({
  selector: 'app-new-suggestion-dialog',
  templateUrl: './new-suggestion-dialog.component.html',
  styleUrls: ['./new-suggestion-dialog.component.scss']
})
export class NewSuggestionDialog implements OnInit {
  event_id;

  @ViewChild(CreateSuggestionComponent) createsuggestionComponent;

  constructor(private dialogRef: MatDialogRef<NewSuggestionDialog>, private eventService: EventService, @Inject(MAT_DIALOG_DATA) data) {
    this.event_id = data.event_id;
  }

  ngOnInit(): void {
  }

  createButtonPressed(data: ITimePlaceSuggestion) {
    this.eventService.createTimePlaceSuggestion(this.event_id, data)
      .then((timePlaceSuggestion) => {
        this.dialogRef.close(timePlaceSuggestion);
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

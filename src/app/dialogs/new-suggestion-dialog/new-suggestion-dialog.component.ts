import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import { ITimePlaceSuggestion } from 'src/app/interfaces/itime-place-suggestion';
import { CreateSuggestionComponent } from 'src/app/frames/create-suggestion/create-suggestion.component';
import { TimePlaceSuggestionService } from 'src/app/services/time-place-suggestion.service';

@Component({
  selector: 'app-new-suggestion-dialog',
  templateUrl: './new-suggestion-dialog.component.html',
  styleUrls: ['./new-suggestion-dialog.component.scss']
})
export class NewSuggestionDialog {
  event_id;

  @ViewChild(CreateSuggestionComponent) createsuggestionComponent;

  constructor(private dialogRef: MatDialogRef<NewSuggestionDialog>, private eventService: EventService, @Inject(MAT_DIALOG_DATA) data, private timePlaceSuggestionService: TimePlaceSuggestionService) {
    this.event_id = data.event_id;
  }

  async createButtonPressed(data: ITimePlaceSuggestion) {
    let timePlaceSuggestion = await this.timePlaceSuggestionService.createTimePlaceSuggestion(this.event_id, data);
    this.dialogRef.close(timePlaceSuggestion);
  }
}

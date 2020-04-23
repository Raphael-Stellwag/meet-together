import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITimePlaceSuggestion } from 'src/app/interfaces/itime-place-suggestion';
import { MatDialog } from '@angular/material/dialog';
import { NewSuggestionDialog } from 'src/app/dialogs/new-suggestion-dialog/new-suggestion-dialog.component';

@Component({
  selector: 'app-add-suggestion-button',
  templateUrl: './add-suggestion-button.component.html',
  styleUrls: ['./add-suggestion-button.component.scss']
})
export class AddSuggestionButtonComponent implements OnInit {
  @Input() event_id;
  @Output() added = new EventEmitter<ITimePlaceSuggestion>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openNewSuggestionDialog() {
    const dialogRef = this.dialog.open(NewSuggestionDialog, {
      data: {
        event_id: this.event_id
      }
    });

    dialogRef.afterClosed().subscribe((suggestion: ITimePlaceSuggestion) => {
      this.added.emit(suggestion);
    });
  }

}

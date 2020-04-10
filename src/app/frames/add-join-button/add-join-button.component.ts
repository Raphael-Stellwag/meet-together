import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { TooltipComponent } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { NewEventDialog } from 'src/app/dialogs/new-event-dialog/new-event-dialog.component';

@Component({
  selector: 'app-add-join-button',
  templateUrl: './add-join-button.component.html',
  styleUrls: ['./add-join-button.component.scss']
})
export class AddJoinButtonComponent implements OnInit, AfterViewInit {

  @ViewChild('tooltip') tooltip: TooltipComponent;
  @Input('showTooltip') showTooltip: boolean;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.tooltip);
      if (this.showTooltip) {
        this.tooltip.show(0);
      }
    });
  }

  openNewEventDialog() {
    const dialogRef = this.dialog.open(NewEventDialog, {
      //height: "500px"
    });

    dialogRef.afterClosed().subscribe(event => {

    });
  }
}

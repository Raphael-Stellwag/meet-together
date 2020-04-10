import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NewUserDialog } from './dialogs/new-user-dialog/new-user-dialog.component';
import { UserMenuComponent } from './frames/user-menu/user-menu.component';
import { UserService } from './services/user.service';
import { TopBarComponent } from './frames/top-bar/top-bar.component';
import { EventService } from './services/event.service';
import { IEvent } from './interfacese/ievent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }
}

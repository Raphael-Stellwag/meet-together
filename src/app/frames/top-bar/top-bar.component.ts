import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  @ViewChild(UserMenuComponent) userMenu: UserMenuComponent;
  @Input("title") title: String;

  constructor() { }

  ngOnInit(): void {
  }

}

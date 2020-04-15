import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { OutputWriterService } from 'src/app/services/output-writer.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  @ViewChild(UserMenuComponent) userMenu: UserMenuComponent;
  @Input("title") title: String;
  @Input("subpage") subpage: boolean;
  @Input("subpageName") subpage_name: String;
  @Input("start_date") start_date: Date = null;
  @Input("end_date") end_date: Date = null;


  constructor(public outputWriter: OutputWriterService) { }

  ngOnInit(): void {
  }

}

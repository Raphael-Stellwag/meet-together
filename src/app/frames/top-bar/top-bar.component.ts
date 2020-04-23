import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { OutputWriterService } from 'src/app/services/output-writer.service';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @Output() triggerShowMenu = new EventEmitter<Object>();


  constructor(public outputWriter: OutputWriterService, private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public username: String;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.updateUserName();
  }

  updateUserName(): void {
    this.username = this.userService.getUserName();
  }
}

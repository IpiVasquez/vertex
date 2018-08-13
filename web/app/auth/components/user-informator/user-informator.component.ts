import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Authenticator } from 'app/auth/authenticator.service';

@Component({
  selector: 'auth-user-informator',
  templateUrl: './user-informator.component.html',
  styleUrls: ['./user-informator.component.css']
})
export class UserInformatorComponent implements OnInit {
  @Output() selected = new EventEmitter<boolean>();
  user: Model.User;

  constructor(private auth: Authenticator) {}

  ngOnInit() {
    this.user = this.auth.user;
  }
}

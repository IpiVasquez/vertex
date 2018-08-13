import { Component, OnInit } from '@angular/core';
import { Authenticator } from 'app/auth/authenticator.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: Model.User;
  meta: any = {};

  constructor(private auth: Authenticator) {}

  ngOnInit() {
    this.user = this.auth.isLogged() ? this.auth.user : undefined;
  }
}

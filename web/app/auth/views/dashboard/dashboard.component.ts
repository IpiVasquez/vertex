import { Component, OnInit } from '@angular/core';
import { Authenticator } from 'app/auth/authenticator.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'auth-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardView implements OnInit {
  user: Model.User;
  meta: any = {};

  constructor(private auth: Authenticator, private http: HttpClient) {}

  ngOnInit() {
    this.user = this.auth.user;
  }
}

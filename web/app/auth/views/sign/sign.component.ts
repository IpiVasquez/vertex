import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Authenticator } from 'app/auth/authenticator.service';

@Component({
  selector: 'auth-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignView implements OnInit {
  constructor(
    private title: Title,
    private auth: Authenticator,
    private router: Router
  ) {}

  ngOnInit() {
    this.title.setTitle('MetaPOS | Sign in');
    this.auth.logout();
  }

  onAuthentication(auth: boolean) {
    if (auth) {
      this.router.navigate([this.auth.redirectUrl || '/']);
    }
  }
}

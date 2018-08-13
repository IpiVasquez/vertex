import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Authenticator } from 'app/auth/authenticator.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class Shell implements OnInit {
  user: Model.User;

  constructor(private auth: Authenticator, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.user;
  }

  /**
   * If user requested, logs the user out.
   */
  logout() {
    this.auth.logout();
    this.router.navigate(['/about']);
  }
}

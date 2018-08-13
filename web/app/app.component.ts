import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'app/core/database.service';
import { ConfigService } from 'app/core/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private db: DatabaseService, private config: ConfigService) {}
}

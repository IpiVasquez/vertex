import { Component, OnInit } from '@angular/core';
import { VertexService } from 'app/vertex/vertex.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'view-vertex-league',
  templateUrl: './vertex-league-view.component.html',
  styleUrls: ['./vertex-league-view.component.css']
})
export class VertexLeagueView implements OnInit {
  ready = false;

  constructor(
    private vertex: VertexService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.vertex.ready.subscribe(
      ready => (this.ready = ready),
      err => {
        console.log(err);
        this.message.error(
          'Something weird happened. Probably the server cannot connect' +
            ' with FPL. Retry later.'
        );
      }
    );
  }
}

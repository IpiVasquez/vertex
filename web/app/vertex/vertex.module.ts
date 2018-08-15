import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VertexLeagueView } from 'app/vertex/views';
import { FixturesComponent } from './components/fixtures/fixtures.component';
import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  {
    path: '',
    component: VertexLeagueView,
    children: [
      { path: '', redirectTo: 'fixtures', pathMatch: 'full' },
      { path: 'fixtures', component: FixturesComponent },
      { path: 'table', component: TableComponent }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes), NgZorroAntdModule],
  declarations: [VertexLeagueView, FixturesComponent, TableComponent]
})
export class VertexModule {}

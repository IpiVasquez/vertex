import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Authorizer } from 'app/auth/authorizer.guard';
import { Shell } from 'app/shell/shell.component';

const routes: Routes = [
  {
    path: 'app',
    component: Shell,
    canActivate: [Authorizer]
  }
];

/**
 * The main shell of the app will be hold in this module.
 */
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FlexLayoutModule],
  declarations: [Shell]
})
export class ShellModule {}

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'app/about/main/main.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AuthModule } from 'app/auth/auth.module';

const routes: Routes = [{ path: 'about', component: MainComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    NgZorroAntdModule,
    AuthModule
  ],
  exports: [RouterModule],
  declarations: [MainComponent]
})
export class AboutModule {}

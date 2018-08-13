import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreInterceptor } from 'app/core/core.interceptor';
import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * This module will implement some core functionalities of the app, such as the
 * API interceptor, translation module among others. Hence this module may act
 * a shared module among the different modules in MetaPOS.
 */
@NgModule({
  imports: [CommonModule, NgZorroAntdModule],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CoreInterceptor,
      multi: true
    }
  ],
  exports: []
})
export class CoreModule {}

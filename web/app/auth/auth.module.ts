import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from 'angular-6-social-login';

import { GSinginButtonDirective } from 'app/auth/directives';
import { AuthInterceptor } from 'app/auth/auth.interceptor';
import { SignView, DashboardView } from 'app/auth/views';
import { environment as env } from 'envs/environment';
import { AuthForm, UserInformatorComponent } from 'app/auth/components';
import { CoreModule } from 'app/core/core.module';
import { Authorizer } from 'app/auth/authorizer.guard';

const routes: Routes = [
  { path: 'sign', component: SignView },
  { path: '', component: DashboardView, canActivate: [Authorizer] }
];

export function getAuthServiceConfigs() {
  return new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(env.gClientId)
    }
  ]);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SocialLoginModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    {
      provide: NZ_I18N,
      useValue: en_US
    }
  ],
  declarations: [
    GSinginButtonDirective,
    DashboardView,
    SignView,
    AuthForm,
    UserInformatorComponent
  ],
  exports: [UserInformatorComponent]
})
export class AuthModule {}

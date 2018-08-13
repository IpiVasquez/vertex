import {
  enableProdMode,
  TRANSLATIONS,
  TRANSLATIONS_FORMAT
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from 'envs/environment';
import { AppModule } from 'app/app.module';

if (environment.production) {
  enableProdMode();
}

declare const require;

// Translations
// const translationsMx = require(`raw-loader!./locale/messages.mx.xlf`);
const providers = [{ provide: TRANSLATIONS_FORMAT, useValue: 'xlf' }];
// switch (localStorage.getItem('localeId')) {
//   case 'es':
//     providers.push({ provide: TRANSLATIONS, useValue: translationsMx });
//     break;
//   default:
//     break;
// }

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    providers: providers
  })
  .catch(err => console.log(err));

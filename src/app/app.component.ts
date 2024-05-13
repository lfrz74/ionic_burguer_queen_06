import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  load: boolean;

  constructor(
    private platform: Platform,
    private translateSrv: TranslateService
  ) {
    this.translateSrv.setDefaultLang('en');
    this.load = false;
    this.initApp();
  }

  initApp() {
    this.platform.ready().then(async () => {
      const language = await Device.getLanguageCode();

      if (language.value) {
        this.translateSrv.use(language.value.slice(0, 2));
      }

      this.load = true;
    });
  }
}

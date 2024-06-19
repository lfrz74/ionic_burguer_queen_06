import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

import { environment } from '../../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  async getUser(email: string) {
    const token = await Preferences.get({ key: KEY_TOKEN });
    const response = await CapacitorHttp.get({
      url: environment.urlApi + 'users',
      params: { email },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(async (response: HttpResponse) => {});
  }
}

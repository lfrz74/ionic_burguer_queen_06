import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

import { environment } from '../../../environments/environment';
import { KEY_TOKEN } from '../../constants/constants';
import { User } from '../../models/user';
import { ErrorApi } from '../../models/error-api';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  async getUser(email: string): Promise<User | ErrorApi> {
    const token = await Preferences.get({ key: KEY_TOKEN });
    const response = await CapacitorHttp.get({
      url: environment.urlApi + 'users',
      params: { email },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token.value,
      },
    })
      .then(async (response: HttpResponse) => {
        const data = response.data;
        if (response.status == 200) {
          return data as User;
        } else {
          const errorApi: ErrorApi = {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error,
          };
          return errorApi;
        }
      })
      .catch((err) => {
        throw err;
      });
    return response;
  }
}

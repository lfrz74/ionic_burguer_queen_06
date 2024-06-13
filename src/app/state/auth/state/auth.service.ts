import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

import { TokenUser } from '../../../models/token.user';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async login(email: string, password: string): Promise<TokenUser> {
    const response = await CapacitorHttp.post({
      url: environment.urlApi + 'auth/login',
      data: {
        email,
        password,
      },
      params: {},
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response: HttpResponse) => {
        if (response.status == 201) {
          const data = response.data as TokenUser;
          return data;
        }
        return null;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
    return response;
  }
}

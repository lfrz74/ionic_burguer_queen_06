import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

import { TokenUser } from '../../models/token.user';
import { environment } from '../../../environments/environment';
import { ErrorApi } from 'src/app/models/error-api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async login(email: string, password: string): Promise<TokenUser | ErrorApi> {
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
        const data = response.data;
        if (response.status == 201) {
          const tokenUser: TokenUser = {
            accessToken: data.accessToken,
          };
          return tokenUser;
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

import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Preferences } from '@capacitor/preferences';

import { Login } from './auth.actions';
import { AuthService } from './auth.service';
import { TokenUser } from '../../models/token.user';
import { KEY_TOKEN } from '../../constants/constants';
import { ErrorApi } from '../../models/error-api';

export class AuthStateModel {
  success: boolean;
  errorApi: ErrorApi;
}

const defaults = {
  success: false,
  errorApi: {
    statusCode: 0,
    message: '',
    error: '',
  },
};

@State<AuthStateModel>({
  name: 'auth',
  defaults,
})
@Injectable()
export class AuthState {
  @Selector()
  static result(state: AuthStateModel) {
    return state;
  }

  constructor(private authService: AuthService) {}

  @Action(Login)
  async login({ setState }: StateContext<AuthStateModel>, { payload }: Login) {
    await this.authService
      .login(payload.email, payload.password)
      .then(async (token: any) => {
        if (token.accessToken) {
          await Preferences.set({ key: KEY_TOKEN, value: token.accessToken });
          setState({
            success: true,
            errorApi: {
              statusCode: token.statusCode,
              message: token.message,
              error: token.error,
            },
          });
        } else {
          setState({
            success: false,
            errorApi: {
              statusCode: token.statusCode,
              message: token.message,
              error: token.error,
            },
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}

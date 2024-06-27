import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { GetUser } from './users.actions';
import { UsersService } from './users.service';
import { ErrorApi } from '../../models/error-api';
import { UserOrderService } from '../../services/user-order.service';
import { User } from 'src/app/models/user';

export class UsersStateModel {
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

@State<UsersStateModel>({
  name: 'users',
  defaults,
})
@Injectable()
export class UsersState {
  @Selector()
  static success(state: UsersStateModel) {
    return state.success;
  }

  constructor(
    private usersSrv: UsersService,
    private userOrderSrv: UserOrderService
  ) {}

  @Action(GetUser)
  async getUser(
    { setState }: StateContext<UsersStateModel>,
    { payload }: GetUser
  ) {
    await this.usersSrv
      .getUser(payload.email)
      .then(async (user: any) => {
        if (user._id) {
          await this.userOrderSrv.saveUser(user as User)
          setState({
            success: true,
            errorApi: {
              statusCode: user.statusCode,
              message: user.message,
              error: user.error,
            },
          });
        } else {
          setState({
            success: false,
            errorApi: {
              statusCode: user.statusCode,
              message: user.message,
              error: user.error,
            },
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}

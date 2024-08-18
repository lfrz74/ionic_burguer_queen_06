import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { CreateOrder } from './orders.actions';
import { ErrorApi } from '../../models/error-api';
import { OrdersService } from './orders.service';

export class OrdersStateModel {
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

@State<OrdersStateModel>({
  name: 'orders',
  defaults,
})
@Injectable()
export class OrdersState {
  @Selector()
  static success(state: OrdersStateModel) {
    return state;
  }

  constructor(private orderService: OrdersService) {}

  @Action(CreateOrder)
  async add(
    { setState }: StateContext<OrdersStateModel>,
    { payload }: CreateOrder
  ) {
    await this.orderService
      .createOrder(payload.order)
      .then(async (success: any) => {
        if (success) {
          setState({
            success: success,
            errorApi: null,
          });
        } else {
          setState({
            success: false,
            errorApi: {
              statusCode: success.statusCode,
              message: success.message,
              error: success.error,
            },
          });
        }
      });
  }
}

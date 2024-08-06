import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Payment } from '../../models/payment';
import { CreatePaymentSheet } from './stripe.actions';
import { StripeService } from './stripe.service';
import { ErrorApi } from 'src/app/models/error-api';

export class StripeStateModel {
  payment: Payment;
  errorApi: ErrorApi;
}

const defaults = {
  payment: null,
  errorApi: {
    statusCode: 0,
    message: '',
    error: '',
  },
};

@State<StripeStateModel>({
  name: 'stripe',
  defaults,
})
@Injectable()
export class StripeState {
  @Selector()
  static payment(state: StripeStateModel) {
    return state;
  }

  constructor(private stripeService: StripeService) {}
  @Action(CreatePaymentSheet)
  async add(
    { setState }: StateContext<StripeStateModel>,
    { payload }: CreatePaymentSheet
  ) {
    await this.stripeService
      .createPaymentSheet(payload.paymentIntent)
      .then(async (pay: any) => {
        if (pay.paymentIntentClientSecret) {
          setState({
            payment: pay,
            errorApi: null,
          });
        } else {
          setState({
            payment: null,
            errorApi: {
              statusCode: pay.statusCode,
              message: pay.message,
              error: pay.error,
            },
          });
        }
      })
      .catch((err) => {
        if (err.stack) {
          setState({
            payment: null,
            errorApi: {
              statusCode: 400,
              message: err.stack,
              error: err.stack,
            },
          });
        } else {
          throw err;
        }
      });
  }
}

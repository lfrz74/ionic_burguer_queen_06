import { CreatePaymentIntent } from '../../models/create-payment-intent';

export class CreatePaymentSheet {
  static readonly type = '[Stripe] Create Payment Sheet';
  constructor(public payload: { paymentIntent: CreatePaymentIntent }) {}
}

import { Order } from '../../models/order';

export class CreateOrder {
  static readonly type = '[Orders] Create order';
  constructor(public payload: { order: Order }) {}
}

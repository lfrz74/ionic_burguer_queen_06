export class ProductsAction {
  static readonly type = '[Products] Add item';
  constructor(public payload: string) { }
}

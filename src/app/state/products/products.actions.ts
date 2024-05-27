export class GetProductsByCategory {
  static readonly type = '[Products] Get Products By Category';
  constructor(public payload: { idCategory: string }) {}
}

export class GetProductById {
  static readonly type = '[Products] Get Product By Id';
  constructor(public payload: { id: string }) {}
}

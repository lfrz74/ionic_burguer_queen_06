import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { ProductsService } from './products.service';
import { Product } from 'src/app/models/product';
import { GetProductById, GetProductsByCategory } from './products.actions';

export class ProductsStateModel {
  products: Product[];
  product: Product;
}

const defaults = {
  products: [],
  product: null,
};

@State<ProductsStateModel>({
  name: 'products',
  defaults,
})
@Injectable()
export class ProductsState {
  @Selector()
  static products(state: ProductsStateModel) {
    return state.products;
  }

  @Selector()
  static product(state: ProductsStateModel) {
    return state.product;
  }

  constructor(private productService: ProductsService) {}

  @Action(GetProductsByCategory)
  async getProductsByCategory(
    { getState, setState }: StateContext<ProductsStateModel>,
    { payload }: GetProductsByCategory
  ) {
    const products = await this.productService.getProductsByCategory(
      payload.idCategory
    );
    const state = getState();
    setState({
      ...state,
      products,
    });
  }

  @Action(GetProductById)
  getProductById(
    { getState, setState }: StateContext<ProductsStateModel>,
    { payload }: GetProductById
  ) {}
}

import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { ProductsAction } from './products.actions';

export class ProductsStateModel {
  public items: string[];
}

const defaults = {
  items: []
};

@State<ProductsStateModel>({
  name: 'products',
  defaults
})
@Injectable()
export class ProductsState {
  @Action(ProductsAction)
  add({ getState, setState }: StateContext<ProductsStateModel>, { payload }: ProductsAction) {
    const state = getState();
    setState({ items: [ ...state.items, payload ] });
  }
}

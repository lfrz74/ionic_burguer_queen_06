import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';

import { GetCategories } from './categories.actions';
import { Category } from '../models/category';

export class CategoriesStateModel {
  categories: Category[];
}

const defaults = {
  categories: [],
};

@State<CategoriesStateModel>({
  name: 'categories',
  defaults,
})
@Injectable()
export class CategoriesState {
  @Action(GetCategories)
  add({ getState, setState }: StateContext<CategoriesStateModel>) {}
}

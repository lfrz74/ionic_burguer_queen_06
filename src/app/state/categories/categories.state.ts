import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Category } from '../../models/category';
import { GetCategories } from './categories.actions';
import { CategoriesService } from './categories.service';

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
  @Selector()
  static categories(state: CategoriesStateModel) {
    return state.categories;
  }

  constructor(private categoriesSrv: CategoriesService) {}

  @Action(GetCategories)
  async getCategories({ setState }: StateContext<CategoriesStateModel>) {
    const categories = await this.categoriesSrv.getCategories();
    setState({
      categories,
    });
  }
}

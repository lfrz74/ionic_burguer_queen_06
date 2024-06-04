import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';

import { Category } from '../../models/category';
import { GetCategories } from '../../state/categories/categories.actions';
import { CategoriesState } from '../../state/categories/categories.state';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {
  @Select(CategoriesState.categories)
  private categories$: Observable<Category[]>;

  public categories: Category[];
  private subscription: Subscription;

  constructor(
    private store: Store,
    private loadingCtrl: LoadingController,
    private translateSrv: TranslateService,
    private navController: NavController,
    private navParams: NavParams
  ) {
    this.categories = [];
  }

  ionViewWillEnter() {
    this.subscription = new Subscription();
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingCtrl.create({
      message: this.translateSrv.instant('label.loading'),
      duration: 3000,
    });

    loading.present();

    this.store.dispatch(new GetCategories());
    const sub = this.categories$.subscribe({
      next: () => {
        this.categories = this.store.selectSnapshot(CategoriesState.categories);
        loading.dismiss();
      },
      error: (err) => {
        console.error(`[loadData]: ${err}`);
        loading.dismiss();
      },
    });
    this.subscription.add(sub);
  }

  goToProducts(category: Category) {
    this.navParams.data['idCategory'] = category._id;
    this.navController.navigateForward('list-products');
  }

  refreshCategories($event: any) {
    this.store.dispatch(new GetCategories());
    $event.target.complete();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}

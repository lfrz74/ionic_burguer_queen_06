import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

import { Category } from '../../models/category';
import { GetCategories } from '../../state/categories/categories.actions';
import { CategoriesState } from '../../state/categories/categories.state';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: any;

  constructor(
    private store: Store,
    private loadingCtrl: LoadingController,
    private translateSrv: TranslateService,
    private navController: NavController,
    private navParams: NavParams
  ) {
    this.categories = [];
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingCtrl.create({
      message: this.translateSrv.instant('label.loading'),
      duration: 3000,
    });

    loading.present();
    this.store.dispatch(new GetCategories()).subscribe({
      next: () => {
        this.categories = this.store.selectSnapshot(CategoriesState.categories);
        loading.dismiss();
      },
      error: (err) => {
        console.error(`[loadData]: ${err}`);
        loading.dismiss();
      },
      complete: () => {
        loading.dismiss();
      },
    });
  }

  goToProducts(category: Category) {
    this.navParams.data['idCategory'] = category._id;
    this.navController.navigateForward('list-products');
  }
}

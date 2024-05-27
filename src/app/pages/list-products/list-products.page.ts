import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { Store } from '@ngxs/store';

import { Product } from '../../models/product';
import { GetProductsByCategory } from '../../state/products/products.actions';
import { ProductsState } from '../../state/products/products.state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage implements OnInit {
  private idCategory: string;
  public products: Product[];

  constructor(
    private navController: NavController,
    private navParams: NavParams,
    private store: Store,
    private loadingCtrl: LoadingController,
    private translateSrv: TranslateService
  ) {
    this.idCategory = this.navParams.data['idCategory'];
    this.products = [];
  }

  async ngOnInit() {
    if (this.idCategory) {
      const loading = await this.loadingCtrl.create({
        message: this.translateSrv.instant('label.loading'),
        duration: 3000,
      });

      loading.present();

      this.store
        .dispatch(
          new GetProductsByCategory({
            idCategory: this.idCategory,
          })
        )
        .subscribe({
          next: () => {
            this.products = this.store.selectSnapshot(ProductsState.products);
          },
          error: (err) => {
            console.error(`[ngOnInit]: ${err}`);
            loading.dismiss();
          },
          complete: () => {
            loading.dismiss();
          },
        });
    } else {
      this.navController.navigateForward('categories');
    }
  }

  goToProduct(product: Product) {
    this.navParams.data['product'] = product;
    this.navController.navigateForward('product');
  }
}

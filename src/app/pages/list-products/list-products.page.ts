import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';

import { Product } from '../../models/product';
import { GetProductsByCategory } from '../../state/products/products.actions';
import { ProductsState } from '../../state/products/products.state';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage {
  @Select(ProductsState.products)
  private product$: Observable<Product[]>;

  private idCategory: string;
  public products: Product[];
  private subscription: Subscription;

  constructor(
    private navController: NavController,
    private navParams: NavParams,
    private store: Store,
    private loadingCtrl: LoadingController,
    private translateSrv: TranslateService
  ) {
    this.products = [];
  }

  //ionViewWillEnter reemplaza al ngOnOInit y ejecuta antes q el ctor dice v
  async ionViewWillEnter() {
    this.subscription = new Subscription();
    this.idCategory = this.navParams.data['idCategory'];

    if (this.idCategory) {
      const loading = await this.loadingCtrl.create({
        message: this.translateSrv.instant('label.loading'),
        duration: 3000,
      });

      loading.present();

      this.store.dispatch(
        new GetProductsByCategory({
          idCategory: this.idCategory,
        })
      );

      const sub = this.product$.subscribe({
        next: () => {
          this.products = this.store.selectSnapshot(ProductsState.products);
          loading.dismiss();
        },
        error: (err) => {
          console.error(`[ngOnInit]: ${err}`);
          loading.dismiss();
        },
      });
      this.subscription.add(sub);
    } else {
      this.navController.navigateForward('categories');
    }
  }

  goToProduct(product: Product) {
    this.navParams.data['product'] = product;
    this.navController.navigateForward('product');
  }

  refreshProducts($event: any) {
    this.store.dispatch(
      new GetProductsByCategory({
        idCategory: this.idCategory,
      })
    );

    $event.target.complete();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}

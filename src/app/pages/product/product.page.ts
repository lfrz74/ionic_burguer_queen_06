import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Store } from '@ngxs/store';

import { Product } from '../../models/product';
import { ProductExtraOption } from '../../models/product-extra-option';
import { ToastService } from '../../services/toast.service';
import { UserOrderService } from '../../services/user-order.service';
import { GetProductById } from '../../state/products/products.actions';
import { ProductsState } from '../../state/products/products.state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage {
  public product: Product; //Ucta v x no poner public estaban saliendo unos errores bien cojudos, te dije ten cuidado
  public total: number;

  constructor(
    private navController: NavController,
    private navParams: NavParams,
    private store: Store,
    private userOrderService: UserOrderService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
    this.product = null;
  }

  ionViewWillEnter() {
    this.product = this.navParams.data['product'];

    if (this.product && this.product.extras) {
      this.total = this.product.price;
    }

    if (!this.product) {
      this.navController.navigateForward('categories');
    }
  }

  changeMultipleOption($event, options: ProductExtraOption[]) {
    if ($event) {
      options.forEach((op) => (op.activate = $event.detail.value == op.name));

      this.calculateTotal();
    }
  }

  calculateTotal() {
    let total = this.product.price;

    this.product.extras.forEach((extra) => {
      extra.blocks.forEach((block) => {
        if (block.options.length == 1 && block.options[0].activate) {
          total += block.options[0].price;
        } else if (block.options.length > 1) {
          const option = block.options.find((op) => op.activate);
          if (option) {
            total += option.price;
          }
        }
      });
    });
    this.total = +total.toFixed(2);
  }

  refreshProduct($event: any) {
    this.store
      .dispatch(new GetProductById({ id: this.product._id }))
      .subscribe({
        next: () => {
          this.product = this.store.selectSnapshot(ProductsState.product);
          this.calculateTotal();
        },
        complete: () => {
          $event.target.complete();
        },
      });
  }

  addProductOrder() {
    this.userOrderService.addProduct(this.product);
    console.log(this.userOrderService.getProducts());
    this.toastService.showToast(
      'top',
      this.translateService.instant('label.product.add.success'),
      'success'
    );

    this.navController.navigateRoot('/');
  }
}

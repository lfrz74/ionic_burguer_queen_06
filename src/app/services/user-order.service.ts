import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { isEqual } from 'lodash-es';

import { Order } from '../models/order';
import { KEY_ORDER } from '../constants/constants';
import { Product } from '../models/product';
import { QuantityProduct } from '../models/quantity-product';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserOrderService {
  private order: Order;

  constructor() {
    this.initOrder();
  }

  async initOrder() {
    const order = await Preferences.get({ key: KEY_ORDER });

    if (!order.value) {
      await this.clear();
    } else {
      this.order = JSON.parse(order.value);
    }
  }

  async saveOrder() {
    await Preferences.set({
      key: KEY_ORDER,
      value: JSON.stringify(this.order),
    });
  }

  async resetOrder() {
    this.order.products = [];
    await this.saveOrder();
  }

  async clear() {
    this.order = new Order();
    this.order.products = [];
    await this.saveOrder();
  }

  async addProduct(product: Product) {
    const productFound = this.searchProduct(product);

    if (productFound) {
      productFound.quantity++;
    } else {
      this.order.products.push({
        product,
        quantity: 1,
      });
    }
    await this.saveOrder();
  }

  private searchProduct(product: Product) {
    return this.order.products.find(
      (p: QuantityProduct) => isEqual(p.product, product) //lodash v
    );
  }

  getProducts() {
    return this.order.products;
  }

  hasUser() {
    return this.order && this.order.user;
  }

  numProducts() {
    if (this.order && this.order.products.length > 0) {
      return this.order.products.reduce(
        (acum: number, value: QuantityProduct) => value.quantity + acum,
        0
      );
    }
    return 0;
  }

  async saveUser(user: User) {
    delete user.password; // nuevo v
    this.order.user = user;
    await this.saveOrder();
  }
}

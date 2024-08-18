import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { isEqual, remove } from 'lodash-es';

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

  async oneMoreProduct(product: Product) {
    const productFound = this.searchProduct(product);

    if (productFound) {
      productFound.quantity++;
    }

    await this.saveOrder();
  }

  async oneLessProduct(product: Product) {
    const productFound = this.searchProduct(product);

    if (productFound) {
      productFound.quantity--;

      if (productFound.quantity <= 0) {
        this.removeProduct(product);
      }
    }

    await this.saveOrder();
  }

  async removeProduct(product: Product) {
    remove(this.order.products, (p: any) => isEqual(p.product, product));
    await this.saveOrder();
  }

  priceProduct(product: Product) {
    let total = product.price;

    if (product.extras) {
      product.extras.forEach((extra) => {
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

    }
    return +total.toFixed(2);
  }

  totalPrice(qP: QuantityProduct) {
    const total = this.priceProduct(qP.product) * qP.quantity;
    return +total.toFixed(2);
  }

  totalOrder(): number {
    let total = 0;
    for (const qP of this.order.products) {
      total += this.totalPrice(qP);
    }
    return total;
  }

  getUser() {
    return this.order.user;
  }

  getOrder() {
    return this.order;
  }
}

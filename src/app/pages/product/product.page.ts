import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  public product: Product; //Ucta v x no poner public estaban saliendo unos errores bien cojudos, te dije ten cuidado

  constructor(
    private navController: NavController,
    private navParams: NavParams
  ) {
    this.product = this.navParams.data['product'];
    console.log('product', this.product);
  }

  ngOnInit() {
    if (!this.product) {
      this.navController.navigateForward('categories');
    }
  }
}

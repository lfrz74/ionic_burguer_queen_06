import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
})
export class ListProductsPage implements OnInit {
  private idCategory: string;

  constructor(
    private navController: NavController,
    private navParams: NavParams
  ) {
    this.idCategory = this.navParams.data['idCategory'];
  }

  ngOnInit() {
    if (this.idCategory) {
    } else {
      this.navController.navigateForward('categories');
    }
  }
}

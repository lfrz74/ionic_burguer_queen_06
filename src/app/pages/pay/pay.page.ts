import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { UserOrderService } from '../../services/user-order.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage {
  public showNewAccount: boolean;
  public step: number;

  constructor(
    public userOrderSrv: UserOrderService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.showNewAccount = false;
    this.step = 1;
  }

  newAccount() {
    this.showNewAccount = true;
  }

  showLogin() {
    this.showNewAccount = false;
  }

  nextStep() {
    this.step++;
  }

  previousStep() {
    this.step--;
  }

  backHome() {
    this.navController.navigateForward('categories');
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';

import { UserOrderService } from '../../services/user-order.service';
import { environment } from '../../../environments/environment';
import { CreatePaymentIntent } from '../../models/create-payment-intent';
import { CreatePaymentSheet } from '../../state/stripe/stripe.actions';
import { StripeState } from '../../state/stripe/stripe.state';
import { Payment } from '../../models/payment';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage {
  @Select(StripeState.payment)
  private payment$: Observable<Payment>;

  public showNewAccount: boolean;
  public step: number;
  public optionAddress: string;
  public showNewAddress: boolean;
  public address: string;
  private subscription: Subscription;

  constructor(
    public userOrderSrv: UserOrderService,
    private navController: NavController,
    private store: Store,
    private toastSrv: ToastService
  ) {}

  ionViewWillEnter() {
    this.showNewAccount = false;
    this.step = 1;
    this.subscription = new Subscription();
    this.optionAddress = 'address-default';
    this.showNewAddress = false;
    this.changeOptionAddress();
    Stripe.initialize({
      publishableKey: environment.stripePublishKey,
    });
    this.detectChangesPayment();
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

  changeOptionAddress() {
    switch (this.optionAddress) {
      case 'address-default':
        this.showNewAddress = false;
        this.address = this.userOrderSrv.getUser().address;
        break;
      case 'choose-address':
        this.showNewAddress = true;
        break;
      default:
        break;
    }
  }

  payWithStripe() {
    const total = this.userOrderSrv.totalOrder() * 100;

    const paymentIntent: CreatePaymentIntent = {
      secretKey: environment.stripeSecretKey,
      amount: +total.toFixed(0),
      currency: 'USD',
      customer_id: 'cus_QX9rLUtNDpoFuB',
    };
    try {
      this.store
        .dispatch(new CreatePaymentSheet({ paymentIntent }))
        .subscribe((err) => {
          if (err.stripe.errorApi) {
            this.toastSrv.showToast(
              'top',
              err.stripe.errorApi.statusCode +
                ':  ' +
                err.stripe.errorApi.message,
              'danger'
            );
          }
        });
    } catch (error) {
      this.toastSrv.showToast('top', error.stack, 'danger');
    }
  }

  detectChangesPayment() {
    const sub = this.payment$.subscribe({
      next: () => {
        const paym = this.store.selectSnapshot(StripeState.payment);
        if (paym.payment) {
          Stripe.createPaymentSheet(paym.payment);
          Stripe.presentPaymentSheet()
            .then((result) => {
              if (result.paymentResult == PaymentSheetEventsEnum.Completed) {
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscription.add(sub);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}

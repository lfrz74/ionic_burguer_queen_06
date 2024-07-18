import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PayPageRoutingModule } from './pay-routing.module';
import { PayPage } from './pay.page';
import { LoginComponent } from "../../shared/login/login.component";
import { CreateAccountComponent } from "../../shared/create-account/create-account.component";
import { ListProductsOrderComponent } from '../../shared/list-products-order/list-products-order.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayPageRoutingModule,
    TranslateModule.forChild(),
    LoginComponent,
    CreateAccountComponent,
    ListProductsOrderComponent
],
  declarations: [PayPage],
})
export class PayPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ListProductsPageRoutingModule } from './list-products-routing.module';
import { ListProductsPage } from './list-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListProductsPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ListProductsPage]
})
export class ListProductsPageModule {}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventType, Router, RoutesRecognized } from '@angular/router';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { UserOrderService } from 'src/app/services/user-order.service';
import { LoginComponent } from '../login/login.component';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from 'src/app/constants/constants';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, LoginComponent],
})
export class ToolbarComponent implements OnInit {
  public showBack: boolean;
  public showInfoUser: boolean;

  constructor(
    private router: Router,
    private navController: NavController,
    public userOrderSrv: UserOrderService,
    private menuController: MenuController,
    private toastSrv: ToastService,
    private translate: TranslateService,
  ) {
    this.showBack = false;
    this.showInfoUser = false;
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event.type == EventType.RoutesRecognized))
      .subscribe({
        next: (evt: RoutesRecognized) => {
          this.showBack = evt.state.root.firstChild.data['showBack'];
        },
      });
  }

  goBack() {
    this.navController.back();
  }

  back() {
    this.showInfoUser = false;
  }

  async logout() {
    await this.userOrderSrv.clear();
    await Preferences.remove({ key: KEY_TOKEN });
    this.navController.navigateForward('categories');
    this.menuController.close('content');
    this.toastSrv.showToast(
      'top',
      this.translate.instant('label.logout.success'),
      'success'
    )
  }

  showPanelInfoUser() {
    this.showInfoUser = true;
  }
}

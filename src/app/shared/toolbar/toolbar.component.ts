import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventType, Router, RoutesRecognized } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { UserOrderService } from 'src/app/services/user-order.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule],
})
export class ToolbarComponent implements OnInit {
  public showBack: boolean;

  constructor(
    private router: Router,
    private navController: NavController,
    public userOrderSrv: UserOrderService
  ) {
    this.showBack = false;
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
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

import { User } from '../../models/user';
import { Login } from '../../state/auth/auth.actions';
import { AuthState } from '../../state/auth/auth.state';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class LoginComponent {
  public user: User;

  @Input() showBack: boolean = true;

  @Output() newAccount: EventEmitter<boolean>;
  @Output() back: EventEmitter<boolean>;
  @Output() doLogin: EventEmitter<boolean>;

  constructor(
    private store: Store,
    private toastSrv: ToastService,
    private translateSrv: TranslateService
  ) {
    this.user = new User();
    this.newAccount = new EventEmitter<boolean>();
    this.back = new EventEmitter<boolean>();
    this.doLogin = new EventEmitter<boolean>();
  }

  login() {
    this.store
      .dispatch(
        new Login({
          email: this.user.email,
          password: this.user.password,
        })
      )
      .subscribe({
        next: () => {
          const result = this.store.selectSnapshot(AuthState.result);
          if (result.success) {
            this.toastSrv.showToast(
              'top',
              this.translateSrv.instant('label.login.success'),
              'success'
            );
            this.doLogin.emit(true);
          } else {
            this.toastSrv.showToast(
              'top',
              result.errorApi.statusCode.toString() +
                '\t' +
                result.errorApi.message +
                '\t' +
                result.errorApi.error,
              'danger'
            );
          }
        },
        error: (err) => {
          this.toastSrv.showToast(
            'top',
            err.message + ':\t' + err.stack,
            'danger'
          );
        },
      });
  }

  exit() {
    this.back.emit(true);
  }

  createNewAccount() {
    this.newAccount.emit(true);
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

import { User } from '../../models/user';
import { ToastService } from '../../services/toast.service';
import { CreateUser, GetUser } from '../../state/users/users.actions';
import { UsersState } from '../../state/users/users.state';
import { Login } from '../../state/auth/auth.actions';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class CreateAccountComponent implements OnInit {
  @Output() back: EventEmitter<boolean>;
  @Output() doCreateAcccount: EventEmitter<boolean>;
  public user: User;
  public createAccountForm: FormGroup;

  constructor(
    private store: Store,
    private toastSrv: ToastService,
    private translateSrv: TranslateService,
    private formBuilder: FormBuilder
  ) {
    this.back = new EventEmitter<boolean>();
    this.doCreateAcccount = new EventEmitter<boolean>();
    this.user = new User();
  }

  ngOnInit(): void {
    this.createAccountForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: [''],
    });
  }
  createAcccount() { //{ value, valid }: { value: any; valid: boolean }) {
    this.store.dispatch(new CreateUser({ user: this.user })).subscribe({
      next: () => {
        const result = this.store.selectSnapshot(UsersState.result);
        if (result.success) {
          this.toastSrv.showToast(
            'top',
            this.translateSrv.instant('label.create.account.success'),
            'success'
          );
          this.store
            .dispatch(
              new Login({
                email: this.user.email,
                password: this.user.password,
              })
            )
            .subscribe({
              next: () => {
                this.store.dispatch(new GetUser({ email: this.user.email }));
              },
            });

          this.doCreateAcccount.emit(true);
        } else {
          this.toastSrv.showToast(
            'top',
            this.translateSrv.instant('label.create.account.error') +
              '.\t\t[ERROR]: ' +
              result.errorApi.message,
            'danger'
          );
        }
      },
    });
  }

  exit() {
    this.back.emit(true);
  }
}

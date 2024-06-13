import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async showToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color:
      | 'danger'
      | 'dark'
      | 'light'
      | 'medium'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'tertiary'
      | 'warning',
    duration = 4000
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
      color: color,
    });

    await toast.present();
  }
}

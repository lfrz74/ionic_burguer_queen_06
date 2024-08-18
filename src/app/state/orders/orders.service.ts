import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

import { environment } from 'environment';
import { KEY_TOKEN } from '../../constants/constants';
import { Order } from '../../models/order';
import { ErrorApi } from '../../models/error-api';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  async createOrder(order: Order): Promise<boolean | ErrorApi> {
    {
      const token = await Preferences.get({ key: KEY_TOKEN });

      return CapacitorHttp.post({
        url: environment.urlApi + 'orders',
        data: {
          ...order,
        },
        params: {},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      })
        .then(async (response: HttpResponse) => {
          const data = response.data;
          if (response.status === 201) {
            const data = response.data as boolean;
            return data;
          } else {
            const errorApi: ErrorApi = {
              statusCode: data.statusCode,
              message: data.message,
              error: data.error,
            };
            return errorApi;
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  }
}

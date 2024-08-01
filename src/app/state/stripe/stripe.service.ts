import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

import { CreatePaymentIntent } from '../../models/create-payment-intent';
import { Payment } from '../../models/payment';
import { environment } from '../../../environments/environment';
import { ErrorApi } from '../../models/error-api';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  async createPaymentSheet(
    paymentIntent: CreatePaymentIntent
  ): Promise<Payment | ErrorApi> {
    const response = await CapacitorHttp.post({
      url: environment.urlApi + 'stripe/intent',
      params: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${paymentIntent.secretKey}`,
      },
      data: {
        ...paymentIntent,
      },
    })
      .then(async (response: HttpResponse) => {
        const data = response.data;
        if (response.status === 201) {
          const payment = response.data as Payment;
          return payment;
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
    return response;
  }
}

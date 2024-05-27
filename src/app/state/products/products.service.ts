import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Product } from 'src/app/models/product';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor() {}

  async getProductsByCategory(idCategory: string): Promise<Product[]> {
    const response = await CapacitorHttp.get({
      url: `${environment.urlApi}products/category/${idCategory}`,
      params: {},
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response: HttpResponse) => {
        if (response.status == 200) {
          const data = response.data as Product[];
          return data;
        }
        return [];
      })
      .catch((err) => {
        console.error(err);
        return [];
      });
    return response;
  }
}

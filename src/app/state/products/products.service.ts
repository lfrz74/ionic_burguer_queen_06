import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';

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

  async getProductById(id: string): Promise<Product> {
    const response = await CapacitorHttp.get({
      url: `${environment.urlApi}products/${id}`,
      params: {},
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response: HttpResponse) => {
        if (response.status == 200) {
          const data = response.data as Product;
          return data;
        }
        return null;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
    return response;
  }

}

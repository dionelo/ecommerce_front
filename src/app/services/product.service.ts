import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProductServer, ServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  // This is to fetch all products from the backend server
  getAllProducts(numberOfResults = 6): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.SERVER_URL + 'products', {
      params: {
        limit: numberOfResults.toString(),
      },
    });
  }

  // Get single product from server
  getSingleProduct(id: number): Observable<ProductServer> {
    return this.http.get<ProductServer>(this.SERVER_URL + 'products/' + id);
  }

  // Get products from one category
  getProductsFromCategory(catName: string): Observable<ProductServer[]> {
    return this.http.get<ProductServer[]>(
      this.SERVER_URL + 'products/category/' + catName
    );
  }
}

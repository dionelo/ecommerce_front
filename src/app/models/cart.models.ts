import { ProductServer } from './product.model';

export interface CartServer {
  total: number;
  data: [
    {
      product: ProductServer;
      numInCart: number;
    }
  ];
}

export interface CartPublic {
  total: number;
  prodData: [
    {
      id: number;
      inCart: number;
    }
  ];
}

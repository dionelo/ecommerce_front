import { Component, OnInit, Inject } from '@angular/core';
import { CartServer } from 'src/app/models/cart.models';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartData: CartServer;
  cartTotal: number;
  subTotal: number;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: CartServer) => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  changeQuantity(index: number, increase: boolean) {
    this.cartService.updateCartItems(index, increase);
  }

}

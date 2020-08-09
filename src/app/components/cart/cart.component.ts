import { Component, OnInit, Inject } from '@angular/core';
import { cartModelServer } from 'src/app/models/cart.models';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from './../../services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartData: cartModelServer
  cartTotal: number
  subTotal: number

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: cartModelServer) => this.cartData = data)
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total)
  }

  ChangeQuantity(index: number, increase: boolean) {
    this.cartService.UpdateCartItems(index, increase)
  }

}
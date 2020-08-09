import { Component, OnInit } from '@angular/core';
import { cartModelServer } from 'src/app/models/cart.models';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: cartModelServer
  cartTotal: number
  authState: boolean

  constructor(public cartService: CartService, public userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total)
    this.cartService.cartData$.subscribe(data => this.cartData = data)
    this.userService.authState$.subscribe(authState => this.authState = authState)
  }

}
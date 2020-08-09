import { Component, OnInit } from '@angular/core';
import { cartModelServer } from 'src/app/models/cart.models';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  	cartTotal: number
	cartData: cartModelServer
	userId
	model: any = {}

  	constructor(
		private cartService: CartService,
		private orderService: OrderService,
		private router: Router,
		private spinner: NgxSpinnerService,
		private userService: UserService	
	) { }

  	ngOnInit(): void {
		this.cartService.cartData$.subscribe(data => this.cartData = data)
		this.cartService.cartTotal$.subscribe(total => this.cartTotal = total)
		this.userService.userData$.subscribe(data => {
			// @ts-ignore
			this.userId = data.userId || data.id
			console.log(this.userId)
		})
	}
	  
	onCheckout() {
		if (this.cartTotal > 0) {
			this.spinner.show().then(p => {
				this.cartService.CheckoutFromCart(this.userId)
			})
		} else {
			return
		}	
	}

	formSubmit() {
		console.log(this.model)
	}
}

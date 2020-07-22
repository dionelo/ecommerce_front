import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
import { cartModelPublic, cartModelServer } from '../models/cart.models';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { ProductModelServer } from '../models/product.model';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})

export class CartService {
    private serverUrl = environment.SERVER_URL
    
    // Data variable to store the cart information on the client's local storage
    private cartDataClient: cartModelPublic = {
        total: 0,
        prodData: [{
            inCart: 0,
            id: 0
        }]        
    }

    // Data variable to store cart information on the server
    private cartDataServer: cartModelServer = {
        total: 0,
        data: [{
            numInCart: 0,
            product: undefined
        }]
    }

    // Observables for the components to subscribe
    cartTotal$ = new BehaviorSubject<number>(0)
    cartData$ = new BehaviorSubject<cartModelServer>(this.cartDataServer)

    constructor(
        private http: HttpClient, 
        private productService: ProductService,
        private orderService: OrderService,
        private router: Router,
        private toast: ToastrService,
        private spinner: NgxSpinnerService
    ) {
        this.cartTotal$.next(this.cartDataServer.total)
        this.cartData$.next(this.cartDataServer)

        // Get the information from local storage (if any)
        let info: cartModelPublic = JSON.parse(localStorage.getItem('cart'))

        // Check if the info variable is null or has some data in it
        if (info !== null && info !== undefined && info.prodData[0].inCart !== 0) {
            // Local Storage is not empty and has some information
            this.cartDataClient = info
            // Loop through each entry an put it in the cartDataServer object
            this.cartDataClient.prodData.forEach(p => {
                this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
                    if (this.cartDataServer.data[0].numInCart === 0) {
                        this.cartDataServer.data[0].numInCart = p.inCart
                        this.cartDataServer.data[0].product = actualProductInfo
                        this.CalculateTotal()
                        this.cartDataClient.total = this.cartDataServer.total
                        localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
                    } else {
                        // cartDataServer already has some entry in it
                        this.cartDataServer.data.push({
                            numInCart: p.inCart,
                            product: actualProductInfo
                        })
                        this.CalculateTotal()
                        this.cartDataClient.total = this.cartDataServer.total
                        localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
                    }
                    this.cartData$.next({...this.cartDataServer})
                })
            })
        }
    }

    AddProductToCart(id: number, quantity?: number) {
        this.productService.getSingleProduct(id).subscribe(prod => {
            // If the cart es empty
            if (this.cartDataServer.data[0].product === undefined) {
                this.cartDataServer.data[0].product = prod
                this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1
                this.CalculateTotal()
                this.cartDataClient.prodData[0].inCart = this.cartDataServer.data[0].numInCart
                this.cartDataClient.prodData[0].id = prod.id
                this.cartDataClient.total = this.cartDataServer.total
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
                this.cartData$.next({...this.cartDataServer})
                this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass: 'toast-top-right'
                })

            // If the cart has some items
            } else {
                // -1 or a positive value
                let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id)

                // if that item is already in the cart  => index is positive value
                if (index !== -1) {
                    if (quantity !== undefined && quantity <= prod.quantity) {
                        this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity
                    } else {
                        this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity
                    }

                    this.cartDataClient.prodData[index].inCart = this.cartDataServer.data[index].numInCart
                    
                    this.toast.info(`${prod.name} quantity updated in the cart`, 'Product Updated', {
                        timeOut: 1500,
                        progressBar: true,
                        progressAnimation: 'increasing',
                        positionClass: 'toast-top-right'
                    })
                
                // If that item is not in the cart
                } else {
                    this.cartDataServer.data.push({
                        numInCart: 1,
                        product: prod
                    })
                    this.cartDataClient.prodData.push({
                        inCart: 1,
                        id: prod.id
                    })

                    this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
                        timeOut: 1500,
                        progressBar: true,
                        progressAnimation: 'increasing',
                        positionClass: 'toast-top-right'
                    })
                }   
                this.CalculateTotal()
                this.cartDataClient.total = this.cartDataServer.total
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
                this.cartData$.next({...this.cartDataServer}) 
            }
        })
    }
    
    UpdateCartItems(index: number, increase: boolean) {
        let data = this.cartDataServer.data[index]

        if (increase) {
            data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity
            this.cartDataClient.prodData[index].inCart = data.numInCart
            this.CalculateTotal()
            this.cartDataClient.total = this.cartDataServer.total
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
            this.cartData$.next({...this.cartDataServer})
        } else {
            if (data.numInCart <= 1) {
                this.DeleteProductFromCart(index)
                this.cartData$.next({...this.cartDataServer})
            } else {
                data.numInCart--
                this.cartData$.next({...this.cartDataServer})
                this.cartDataClient.prodData[index].inCart = data.numInCart
                this.CalculateTotal()
                this.cartDataClient.total = this.cartDataServer.total
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
            }
        }
    }
    
    DeleteProductFromCart(index: number) {
        if (window.confirm('Are you sure you want to remove the item?')) {
            this.cartDataServer.data.splice(index, 1)
            this.cartDataClient.prodData.splice(index, 1)
            this.CalculateTotal()
            this.cartDataClient.total = this.cartDataServer.total

            if (this.cartDataClient.total === 0) {
                this.cartDataClient = {total: 0, prodData: [{inCart: 0, id: 0}]}
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
            } else {
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
            }

            if (this.cartDataServer.total === 0) {
                this.cartDataServer = {total: 0, data: [{numInCart: 0, product: undefined}]}
                this.cartData$.next({...this.cartDataServer})
            } else {
                this.cartData$.next({...this.cartDataServer})
            }

        } else {
            // If the user clicks the cancel button
            return
        }
    }

    CheckoutFromCart(userId: number) {
        this.http.post(`${this.serverUrl}orders/payment`, null).subscribe((res: {success: boolean}) => {
            if (res.success) {
                this.resetServerData()
                this.http.post(`${this.serverUrl}orders/new`, {
                    userId: userId,
                    products: this.cartDataClient.prodData
                }).subscribe((data: OrderResponse) => {
                    this.orderService.getSingleOrder(data.order_id).then(prods => {
                        if (data.success) {
                            const navigationExtras: NavigationExtras = {
                                state: {
                                    message: data.message,
                                    products: prods,
                                    orderId: data.order_id,
                                    total: this.cartDataClient.total
                                }
                            }

                            this.spinner.hide().then()
                            this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                                this.cartDataClient = {total: 0, prodData: [{inCart: 0, id: 0}]}
                                this.cartTotal$.next(0)
                                localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
                            })
                        }
                    })
                })
            } else {
                this.spinner.hide().then()
                this.router.navigateByUrl('/checkout').then()
                this.toast.error(`Sorry, failed to book the order`, 'Order Status', {
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass: 'toast-top-right'
                })
            }
        })
    }

    private CalculateTotal() {
        let Total = 0

        this.cartDataServer.data.forEach(p => {
            const {numInCart} = p
            const {price} = p.product
            Total += numInCart * price
        })
        this.cartDataServer.total = Total
        this.cartTotal$.next(this.cartDataServer.total)
    }

    private resetServerData() {
        this.cartDataServer = {
            total: 0,
            data: [{
                numInCart: 0,
                product: undefined
            }]
        }
        this.cartData$.next({...this.cartDataServer})
    }

    CalculateSubTotal(index) : number {
        let subTotal = 0
        const p = this.cartDataServer.data[index]
        subTotal = p.product.price * p.numInCart
        return subTotal
    }
}

interface OrderResponse {
    order_id: number
    success: boolean
    message: string
    products: [{
        id: string,
        numInCart: string
    }]
}
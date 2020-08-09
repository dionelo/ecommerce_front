import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { CartComponent } from './components/cart/cart.component'
import { CheckoutComponent } from './components/checkout/checkout.component'
import { HomeComponent } from './components/home/home.component'
import { ProductComponent } from './components/product/product.component'
import { ThankyouComponent } from './components/thankyou/thankyou.component'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { EmailValidator, FormsModule, NG_ASYNC_VALIDATORS, ReactiveFormsModule } from '@angular/forms'
import { LoginComponent } from './components/login/login.component'
import { ProfileComponent } from './components/profile/profile.component'
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login'
import { RegisterComponent } from './components/register/register.component'
import { HomeLayoutComponent } from './components/home-layout/home-layout.component'
import { AdminComponent } from './components/admin/admin.component'

const config = new AuthServiceConfig([
	{
		id: GoogleLoginProvider.PROVIDER_ID,
		provider: new GoogleLoginProvider("510682711020-jcnvs629irv01b7nj78vmdjfj90nnuen.apps.googleusercontent.com")
	}
])

export function provideConfig() {
	return config
}

@NgModule({
  	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		CartComponent,
		CheckoutComponent,
		HomeComponent,
		ProductComponent,
		ThankyouComponent,
		LoginComponent,
		ProfileComponent,
		RegisterComponent,
		HomeLayoutComponent,
		AdminComponent
  	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		NgxSpinnerModule,
		ToastrModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		SocialLoginModule
	],
	providers: [
		{
			provide: AuthServiceConfig,
			useFactory: provideConfig
		}
	],
  	bootstrap: [AppComponent]
})

export class AppModule { }
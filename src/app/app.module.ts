import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { RegisterComponent } from './home/register/register.component';
import { ReactiveFormsModule } from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthGuard} from "./services/auth-guard.service";
import { NavbarComponent } from './navbar/navbar.component';
import { NavLeftComponent } from './navbar/nav-left/nav-left.component';
import { NavTopComponent } from './navbar/nav-top/nav-top.component';
import { NavRightComponent } from './navbar/nav-right/nav-right.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { HeaderComponent } from './header/header.component';
import { InventoryComponent } from './header/inventory/inventory.component';
import { FooterComponent } from './footer/footer.component';
import { ExpeditionModuleComponent } from './dashboard/expedition-module/expedition-module.component';
import { AchievementModuleComponent } from './dashboard/achievement-module/achievement-module.component';
import { StablesComponent } from './stables/stables.component';
import { AuthHeaderInterceptor } from "./services/auth-header.interceptor";
import { CreatureCardComponent } from './stables/creature-card/creature-card.component';
import { LoginResolver } from "./services/login-resolver.service";
import { CreatureComponent } from './creature/creature.component';
import { ActionsLeftComponent } from './creature/actions-left/actions-left.component';
import { ActionsRightComponent } from './creature/actions-right/actions-right.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EggComponent } from './creature/egg/egg.component';
import { HatcheryComponent } from './hatchery/hatchery.component';
import { DigitalClockComponent } from './digital-clock/digital-clock.component';
import { NotImplementedComponent } from './not-implemented/not-implemented.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    NavLeftComponent,
    NavTopComponent,
    NavRightComponent,
    HeaderComponent,
    InventoryComponent,
    FooterComponent,
    ExpeditionModuleComponent,
    AchievementModuleComponent,
    StablesComponent,
    CreatureCardComponent,
    CreatureComponent,
    ActionsLeftComponent,
    ActionsRightComponent,
    NotFoundComponent,
    EggComponent,
    HatcheryComponent,
    DigitalClockComponent,
    NotImplementedComponent
  ],
    imports: [
      BrowserModule,
      HttpClientModule,
      FontAwesomeModule,
      NgbModule,
      RouterModule.forRoot([
        {path: '', component: HomeComponent},
        {path: 'register', component: RegisterComponent},

        {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
        {path: 'stables', component: StablesComponent, canActivate: [AuthGuard]},
        {path: 'hatchery', component: HatcheryComponent, canActivate: [AuthGuard]},
        {path: 'store', component: NotImplementedComponent, canActivate: [AuthGuard]},
        {path: 'achievements', component: NotImplementedComponent, canActivate: [AuthGuard]},
        {path: 'wiki', component: NotImplementedComponent, canActivate: [AuthGuard]},

        {path: 'creature/:id', component: CreatureComponent, canActivate: [AuthGuard]},
        {path: 'egg/:id', component: EggComponent, canActivate: [AuthGuard]},

        // {path: 'products', component: ProductsComponent},
        // {path: 'shopping-cart', component: ShoppingCartComponent},
        // {path: 'login', component: LoginComponent},
        //
        // {path: 'my/orders', component: MyOrdersComponent, canActivate: [AuthGuard]},
        // {path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard]},
        // {path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard]},
        //
        // {path: 'admin/products/new', component: ProductFormComponent, canActivate: [AuthGuard, AdminAuthGuard]}, //specific to generic routes
        // {path: 'admin/products/:id', component: ProductFormComponent, canActivate: [AuthGuard, AdminAuthGuard]},
        // {path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminAuthGuard]},
        // {path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminAuthGuard]},

        {path: '**', component: NotFoundComponent},
      ]),
      ReactiveFormsModule,
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true // Add this line when using multiple interceptors.
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

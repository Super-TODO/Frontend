import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OtpVerificationComponent } from './components/otp-verification/otp-verification.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'verify-otp', component: OtpVerificationComponent },
    { path: 'item-list', component: ItemListComponent },
    { path: 'item-form', component: ItemFormComponent },
    { path: 'sidebar', component: SidebarComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
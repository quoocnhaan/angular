import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Home } from './home/home';
import { Login } from './login/login';
import { authGuard } from './auth-guard';
import { CategoryComponent } from './category/category';

export const routes: Routes = [

    {
        path: 'register', component: Register
    }
    , {
        path: '', redirectTo: 'home', pathMatch: 'full'
    }, {
        path: 'home', component: Home, canActivate: [authGuard]
    },
    {
        path: 'login', component: Login
    },
    {
        path: 'categories', component: CategoryComponent, canActivate: [authGuard]
    },
    {
        path: '**', redirectTo: 'login'
    },

];

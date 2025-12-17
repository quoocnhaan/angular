import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Home } from './home/home';

export const routes: Routes = [

    {
        path: 'register', component: Register
    }
    , {
        path: '**', redirectTo: 'register', pathMatch: 'full'
    }

];

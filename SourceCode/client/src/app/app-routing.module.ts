import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { AuthGuard } from './_helpers';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PanelComponent } from './panel/panel.component';
import { AccountComponent } from './account/account.component'

const routes: Routes = [
    { path: '', component: LoginComponent, canActivate:[AuthGuard]},
    { path: 'login', component: LoginComponent, canActivate:[AuthGuard]},
    { path: 'register', component: RegisterComponent, canActivate:[AuthGuard] },
    { path: 'panel', component: PanelComponent, canActivate:[AuthGuard] },
    { path: 'account', component: AccountComponent, canActivate:[AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
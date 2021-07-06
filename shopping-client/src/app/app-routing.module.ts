import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillComponent } from './components/bill/bill.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
//import { IsAdminGuard } from './guards/is-admin.guard';
import { IsUserGuard } from './guards/is-user.guard';
import { TokenGuard } from './guards/token.guard';

const routes: Routes = [
  {path:'welcome', component:WelcomeComponent, children:[
    {path:'register', component:RegisterComponent},
    {path:'', pathMatch: "full", component:LoginComponent},
    {path:'**', redirectTo:''}
  ]},
  {path:'main', component:MainComponent, canActivate:[TokenGuard]},
  {path:'bill', component:BillComponent, canActivate:[TokenGuard, IsUserGuard]}, 
  {path:'', pathMatch: "full", redirectTo:'welcome'},
  {path:'**', redirectTo:'welcome'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

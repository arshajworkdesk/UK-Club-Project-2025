import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { OtpVerificationComponent } from './pages/otp-verification/otp-verification.component';
import { HomeComponent } from './pages/home/home.component';
import { MembersComponent } from './pages/members/members.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'membership', component: RegistrationComponent },
  { path: 'membership/verify-otp', component: OtpVerificationComponent },
  { path: 'register', redirectTo: '/membership', pathMatch: 'full' },
  { path: 'members', component: MembersComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/forgot-password', component: ForgotPasswordComponent },
  { path: 'admin/reset-password', component: ResetPasswordComponent, canActivate: [AdminGuard] },
  { path: 'admin/profile', component: ProfileEditComponent, canActivate: [AdminGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }


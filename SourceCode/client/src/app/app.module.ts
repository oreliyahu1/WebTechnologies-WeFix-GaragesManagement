import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from './shared/_modal';

//Mat_Modules
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule}  from '@angular/material/icon';
import { MatListModule}  from '@angular/material/list';
import { MatButtonModule}  from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';

//Components
import { AlertHeaderComponent } from './shared/alert/alert-header.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PanelComponent } from './panel/panel.component';
import { AccountComponent } from './account/account.component'
import { WelcomeComponent } from './panel/welcome/welcome.component';
import { TreatmentsComponent } from './panel/treatments/treatments.component';
import { UsersComponent } from './panel/users/users.component';
import { MapComponent } from './panel/map/map.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { SideComponent } from './panel/shared/side/side.component';
import { AlertComponent } from './shared/alert/alert.component';
import { FieldErrorDisplayComponent } from './shared/field-error-display/field-error-display.component';
import { PassValidator, PassMatchValidator } from './shared/validators/';
import { ForgotPasswordComponent } from './login/forgotpassword.component';
import { BrandchartComponent } from './panel/welcome/brandchart/brandchart.component';


//services
import { SharedService } from './shared/shared.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreatmentDialogBoxComponent } from './panel/dialog-box/treatment-dialog-box.component';
import { UserDialogBoxComponent } from './panel/dialog-box/user-dialog-box.component';
import { MapDialogBoxComponent } from './panel/dialog-box/map-dialog-box.component';

//Interceptor
import { JwtInterceptor, ErrorInterceptor, SyncInterceptor } from './_helpers';
  
@NgModule({
	declarations: [
    AlertHeaderComponent,
		AppComponent,
    LoginComponent,
    RegisterComponent,
    PanelComponent,
    AccountComponent,
    AlertComponent,
		FooterComponent,
    HeaderComponent,
    SideComponent,
    FieldErrorDisplayComponent,
    PassValidator,
    PassMatchValidator,
    ForgotPasswordComponent,
    WelcomeComponent,
    UsersComponent,
    BrandchartComponent,
    TreatmentsComponent,
    TreatmentDialogBoxComponent,
    UserDialogBoxComponent,
    MapDialogBoxComponent,
    MapComponent,
     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    NgbModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    HighchartsChartModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [SharedService,
    { provide: HTTP_INTERCEPTORS, useClass: SyncInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
  bootstrap: [AppComponent],
})
export class AppModule { }
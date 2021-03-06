import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http'

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { apiKeys, Login } from './interfaces/login';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        MatSnackBarModule,
        MatMenuModule
  ],
  providers: [AppComponent, HomeComponent, Login, apiKeys],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductoComponent } from './producto/producto.component';  
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';

import { TableModule } from 'primeng/table';  
import { ButtonModule } from 'primeng/button';  
import { DialogModule } from 'primeng/dialog';  
import { InputTextModule } from 'primeng/inputtext';  
import { ToastModule } from 'primeng/toast';  
import { MessageService } from 'primeng/api';
import { BodegaComponent } from './bodega/bodega.component';  

@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        ProductoComponent,
        BodegaComponent  
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,  
        HttpClientModule,  
        FormsModule,  
        ReactiveFormsModule,  
        AppRoutingModule,  
        AppLayoutModule,   
        TableModule,  
        ButtonModule,  
        DialogModule,  
        InputTextModule, 
        ToastModule,
        CalendarModule,
        DropdownModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        MessageService  
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgApexchartsModule } from "ng-apexcharts";
import { CacheService } from "./cache.service";
import { PanelModule } from "primeng/panel";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule,
    PanelModule,
    BrowserAnimationsModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
  ],
  providers: [CacheService],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule {}

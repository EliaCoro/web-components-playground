import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TUI_SANITIZER } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './layout/layout.component'
import { HttpClientModule } from "@angular/common/http";
import { QuickAddQuotasPageComponent } from './pages/quick-add-quotas-page/quick-add-quotas-page.component';
import { QuickAddQuotasModule } from "projects/quick-add-quotas/src/public-api";
import { TuiActionModule } from "@taiga-ui/kit";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    QuickAddQuotasPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    QuickAddQuotasModule,
    TuiRootModule,
    TuiActionModule
],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule { }

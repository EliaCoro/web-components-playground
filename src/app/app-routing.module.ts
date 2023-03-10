import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LayoutComponent } from "./layout/layout.component";
import { QuickAddQuotasPageComponent } from "./pages/quick-add-quotas-page/quick-add-quotas-page.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'quick-add-quotas',
        component: QuickAddQuotasPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }

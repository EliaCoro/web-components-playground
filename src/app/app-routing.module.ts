import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LpdaDownloadMenuShowcaseComponent } from "./pages/lpda-download-menu-showcase/lpda-download-menu-showcase.component";
import { LayoutComponent } from "./layout/layout.component";

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
        path: 'lpda-dropdown-menu',
        component: LpdaDownloadMenuShowcaseComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },

  {
    path: 'tab1',
    loadChildren: './tab1/tab1.module#Tab1PageModule'
  },

  {
    path: 'tab2',
    loadChildren: './tab2/tab2.module#Tab2PageModule'
  },
  { path: 'tabs',
    loadChildren: './tabs/tabs.module#TabsPageModule'
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

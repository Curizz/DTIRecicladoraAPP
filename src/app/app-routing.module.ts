import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AreasListComponent } from './areas/areas-list/areas-list.component';
import { IndexComponent } from './index/index.component';
import { AuthComponent } from './auth/auth/auth.component';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CatalogosComponent } from './catalogos/catalogos.component';
import { RolesGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },{
    path: 'index',
    component: IndexComponent
  },{
    path: 'login',
    component: AuthComponent
  },
  {
    path:'dashboard',
    component: PagesComponent,
    canActivate:[AuthGuard],
    children:[
      {
        path: 'tablero',
        component:DashboardComponent
      },
      {
        path: 'catalogos',
        component:CatalogosComponent
      },
      {
        path: 'areas',
        loadChildren: () =>
        import('./areas/areas.module').then(m => m.AreasModule),
        canActivate: [RolesGuard],
      },
      {
        path:'maquinarias',
        loadChildren:()=>
        import('./maquinaria/maquinaria.module').then(m => m.MaquinariaModule),
        canActivate: [RolesGuard],
      },
      {
        path:'produccion-empleado',
        loadChildren: () =>
        import ('./produccionEmpleado/produccion-empleado.module').then(m => m.ProduccionEmpleadoModule),
      },
      {
        path:'solicitudes',
        loadChildren: () =>
        import ('./solicitudes/solicitudes.module').then(m => m.SolicitudesModule)
      },{
        path:'proveedores',
        loadChildren: () =>
        import ('./proveedores/proveedores.module').then(m => m.ProveedoresModule)
      },
      {
        path:'users',
        loadChildren: () =>
        import ('./usuarios/Users.module').then(m => m.UsersModule)
      },
      {
        path:'gastos',
        loadChildren:()=>
        import ('./gastos/gastos.module').then(m => m.GastosModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

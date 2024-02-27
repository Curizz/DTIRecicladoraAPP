import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AreasModule } from './areas/areas.module';
import { IndexComponent } from './index/index.component';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CatalogosComponent } from './catalogos/catalogos.component';
import { MaquinariaModule } from './maquinaria/maquinaria.module';
import { AvisosModule } from './avisos/aviso.module';
import { ProduccionEmpleadoModule } from './produccionEmpleado/produccion-empleado.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { UsersModule } from './usuarios/Users.module';
import { GastosModule } from './gastos/gastos.module';

@NgModule({
  declarations: [AppComponent,
                 IndexComponent,
                 DashboardComponent,
                 CatalogosComponent
                ],
  imports: [
            BrowserModule, 
            IonicModule.forRoot(), 
            AppRoutingModule, 
            AreasModule,
            AuthModule,
            PagesModule,
            AvisosModule,
            MaquinariaModule,
            ProduccionEmpleadoModule,
            SolicitudesModule,
            ProveedoresModule,
            UsersModule,
            GastosModule
          ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

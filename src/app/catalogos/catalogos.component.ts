import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.scss'],
})
export class CatalogosComponent  implements OnInit {
  usuarioTienePermiso: boolean;
  constructor() { // Visualizar de acuerdo al rol
  this.usuarioTienePermiso = this.verificarPermisosDelUsuario();}
  private verificarPermisosDelUsuario(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    const puesto = localStorage.getItem("Puesto");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return ((nombreUsuario === "Administrador") || (nombreUsuario === "SuperAdministrador")); // Ejemplo: el usuario con rol "admin" tiene permiso
  }
  ngOnInit() {}

}

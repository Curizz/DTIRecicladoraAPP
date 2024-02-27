import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from './proveedores';
import { PeriodicElement } from './PeriodicElement';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  // URL DE LA LLAMADA A LA API
  API: string = 'https://recicladora.arvispace.com/PhpAngular/proveedores/'

  // API: string = 'http://localhost/PhpAngular/proveedores/';

  // CONSTANTES PARA GUARDAR EL CORREO Y NOMBRE DEL USUARIO DESDE EL LOCALSTORAGE
  private correo: string='';
  private nombre: string='';
  private tipoUsuario: string='';
  private  idFabricaUsuario: string='';

  constructor( private clientService:HttpClient) { }

  // AGREGAMOS UN REGISTRO
  agregarProveedor(datosProveedor:Proveedor):Observable<any>{
    return this.clientService.post(this.API+"?insertarProvedoresPro=1",datosProveedor);
  }

  // OBTENEMOS TODOS LOS REGISTROS
  listarProveedor(): Observable<PeriodicElement[]> {
    return this.clientService.get<PeriodicElement[]>(this.API+"?obtenerProvedores=1");
  }

  // ELIMINAMOS UN REGISTRO DE ACUERDO AL ID
  borrarProveedor(idProveedor:any, usuarioEliminador: any):Observable<any>{
    return this.clientService.get(`${this.API}?borrarProveedor=${idProveedor}&UsuarioEliminador=${usuarioEliminador}`);
  }

  // OBTENEMOS UN REGISTRO POR EL ID
  obtenerProveedor(idProveedor:string):Observable<any>{
    return this.clientService.get(this.API+"?consultarProveedor="+idProveedor);
  }

  // ACTUALIZAMOS UN REGISTRO
  editarProveedor(idProveedor:any, datosProveedor:Proveedor):Observable<any>{
    return this.clientService.post(this.API+"?actualizarProvedores="+idProveedor,datosProveedor);
  }

  // OBTENEMOS LOS DATOS DE LA TABLA INVENTARIO FABRICA
  selectInventarioFabrica(){
    return this.clientService.get<any[]>(this.API+"?selectInventarioFabrica");
  }

  getProveedores(){
    return this.clientService.get<any[]>(this.API+"?selectProveedor=1");
  }

  // OBTENEMOS EL CORREO DEL LOCALSTORAGE
  getCorreo(): string {
    return this.correo = localStorage.getItem("Correo") || '';
  }

  // OBTENEMOS EL NOMBRE DEL LOCALSTORAGE
  getNombre(): string {
    return this.nombre = localStorage.getItem("Nombre") || '';
  }

  getTipoUsuario(): string {
    return this.tipoUsuario = localStorage.getItem("NombreTipoUser") || '';
  }

  // OBTENEMOS idfabrica del usuario por LOCALSTORAGE
  getIdFabricaUsuario(): string {
    return this.idFabricaUsuario = localStorage.getItem("idFabrica") || '';
  }

}

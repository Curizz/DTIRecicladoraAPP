import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maquina } from './maquinaria';
import { PeriodicElement } from './PeriocElement';

@Injectable({
  providedIn: 'root'
})
export class MaquinasService {
API: string = 'https://recicladora.arvispace.com/PhpAngular/maquinas/'

   //API: string = 'http://localhost/PhpAngular/maquinas/';
   private correo: string='';
   private nombre: string='';
   private fabrica: string='';
   private tipoUsuario: string='';

  constructor( private clientService:HttpClient) { }

  getAreas(){
    return this.clientService.get<any[]>(this.API+"?selectArea=1");
  }


  /*agregarMaquina(datosMaquina:Maquina):Observable<any>{
    return this.clientService.post(this.API+"?insertar=1",datosMaquina);
  }*/

  //Este metodo inserta con procedimientos almacenados
  agregarMaquina(datosMaquina:Maquina):Observable<any>{
    return this.clientService.post(this.API+"?insertarMaquinasv2=1",datosMaquina);
  }


   /*listarMaquina(): Observable<PeriodicElement[]> {
    return this.clientService.get<PeriodicElement[]>(this.API+"?seleccionar=1");
  }*/

  //Este metodo lista las maquinas con procedimientos almacenados
  listarMaquina(): Observable<PeriodicElement[]> {
    return this.clientService.get<PeriodicElement[]>(this.API+"?obtenerMaquinas=1");
  }

  /*eliminarMaquina(id: any): Observable<any> {
    return this.clientService.delete(this.API + "?borrar=" + id);
  }*/

  //Eliminar maquinas con procedimientos almacenados

  eliminarMaquina(id: any, usuarioEliminador: any): Observable<any> {
    return this.clientService.delete(`${this.API}?borrarMaquina=${id}&UsuarioEliminador=${usuarioEliminador}`);
  }


  /*consultarmaquina(id: any):Observable<any>{
    return this.clientService.get(this.API + "?consultarmaquina=" + id);
  }*/

  //Consultar maquinas por id con procedimientos almacenados
  consultarmaquina(id: any):Observable<any>{
    return this.clientService.get(this.API + "?consultarmaquinaPro=" + id);
  }

   /*actualizarMaquina(id: any, datosMaquina: Maquina): Observable<any> {
    return this.clientService.post(this.API + "?actualizarv2=" + id, datosMaquina);
  }*/

  //Editar maquina por id con procedimiento
 actualizarMaquina(id: any, datosMaquina: Maquina): Observable<any> {
    return this.clientService.post(this.API + "?actualizarMaquina=" + id, datosMaquina);
  }

   // OBTENEMOS EL CORREO DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
  getCorreo(): string {
    return this.correo = localStorage.getItem("Correo") || '';
  }

  // OBTENEMOS EL NOMBRE DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
  getNombre(): string {
    return this.nombre = localStorage.getItem("Nombre") || '';
  }

  getIdFabrica(): string {
    return this.fabrica = localStorage.getItem("idFabrica") ||'';
  }

  getTipoUsuario(): string {
    return this.tipoUsuario = localStorage.getItem('NombreTipoUser') || '';
  }

}

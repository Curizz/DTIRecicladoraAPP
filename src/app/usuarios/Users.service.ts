import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './Users';
import { UserEdit } from './UsersEdit';
import { PeriodicElement } from './PeriodicElement';


@Injectable({
    providedIn: 'root'
  })

  export class UserService{


     // URL DE LA LLAMADA A LA API
  API: string = 'https://recicladora.arvispace.com/PhpAngular/'

  // API: string = 'http://localhost/PhpAngular/';

  // CONSTANTES PARA GUARDAR EL CORREO Y NOMBRE DEL USUARIO DESDE EL LOCALSTORAGE
  private correo: string = '';
  private nombre: string = '';
  private tipoUsuario: string= '';
  private idFabricaUsuario: string= '';

  constructor( private clientService:HttpClient) { }

  // AGREGAMOS UN NUEVO REGISTRO EN LA TABLA
  AgregarUsuartio(datosEmpleado:User):Observable<any>{
    return this.clientService.post(this.API+"?insertarUsuarioPro=1",datosEmpleado);
  }

  // OBTENEMOS TODOS LOS REGISTROS DE LA TABLA
  listaEmpleado(): Observable<PeriodicElement[]> {
    return this.clientService.get<PeriodicElement[]>(this.API+"?obtenerUsuarios=1");
  }

  // ELIMINAMOS UN REGISTRO DE LA TABLA
  eliminarUsuario(id:any, usuarioEliminador: any): Observable<any> {
    return this.clientService.get(`${this.API}?borrarUsuario=${id}&UsuarioEliminador=${usuarioEliminador}`);
  }

  // OBTENEMOS UN REGISTRO DE LA TABLA
  EditarEmpleado(idUsuario:string): Observable<any> {
    return this.clientService.get(this.API+"?editarEmpleado="+idUsuario);
  }

  // ACTUALIZAMOS UN REGISTRO DE LA TABLA
  UpdateEmpleado(id:any, UpdateEmpleado:User):Observable<any>{
    return this.clientService.post(this.API+"?updateEmpleado="+id,UpdateEmpleado);
  }

  // OBTENEMOS LOS REGISTROS DE AREAS
  SelectAreas (){
    return this.clientService.get<any[]>(this.API+"?selectArea");
  }

  // OBTENEMOS LOS REGISTROS DE ASIGNACION
  SelectPuestos (){
    return this.clientService.get<any[]>(this.API+"?selectPuesto");
  }

   // OBTENEMOS LOS REGISTROS DE TIPOS DE USUARIOS
  SelectTipoUsuarios (){
    return this.clientService.get<any[]>(this.API+"?selectTipoUsuario");
  }

   // OBTENEMOS LOS REGISTROS DE TIPOS DE USUARIOS
   SelectFabricas (){
    return this.clientService.get<any[]>(this.API+"?selectFabrica");
  }


   // OBTENEMOS EL CORREO DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
   getCorreo(): string {
    return this.correo = localStorage.getItem("Correo") || '';
  }

  // OBTENEMOS EL NOMBRE DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
  getNombre(): string {
    return this.nombre = localStorage.getItem("Nombre") || '';
  }

  getTipoUsuario(): string {
    return this.tipoUsuario = localStorage.getItem("NombreTipoUser") || '';
  }

  getIdFabricaUsuario(): string {
    return this.idFabricaUsuario = localStorage.getItem("idFabrica") || '';
  }

  }
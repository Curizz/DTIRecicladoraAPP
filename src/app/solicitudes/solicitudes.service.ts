import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { solicitud } from './solicitud';
import { PeriodicElement } from './PeriodicElement';
import { Estado } from './estado';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
 //API: string = 'https://recicladora.arvispace.com/PhpAngular/solicitudes/'

 API: string = 'http://localhost/PhpAngular/solicitudes/';
  private correo: string='';
  private nombre: string='';
  private fabrica: string='';
  private tipoUsuario: string='';
  private idUser: string='';

  constructor( private clientService:HttpClient) { }

  agregarSolicitud(datosSolicitud:solicitud):Observable<any>{
    return this.clientService.post(this.API+"?insertarSolicitud1=1",datosSolicitud);
  }

  listarSolicitud(): Observable<PeriodicElement[]> {
    return this.clientService.get<PeriodicElement[]>(this.API+"?Solicitudes=1");
  }

  listarSolicitudPorUsuario(id:any): Observable<PeriodicElement[]>{
    return this.clientService.get<PeriodicElement[]>(this.API+"?SolicitudesPorUsuario="+id);
  }

  aprobarorechazarSoli(datosEstado:Estado):Observable<any>{
    return this.clientService.post(this.API+"?actualizarEstadoSolicitud=1",datosEstado);
  }
  /*borrarSolicitud(id:any):Observable<any>{
    return this.clientService.delete(this.API+"?borrarSolicitud="+id);
  }*/

  borrarSolicitud(id: any, usuarioEliminador: any): Observable<any> {
    return this.clientService.delete(`${this.API}?borrarSolicitud=${id}&UsuarioEliminador=${usuarioEliminador}`);
  }


  //Actualizar y consultar
  consultarSolicitudes(id:any): Observable<PeriodicElement> {
    return this.clientService.get<PeriodicElement>(this.API+"?consultarSolicitudes="+id);

  }

  editarSolicitud(id:any, datosSolicitud:solicitud):Observable<any>{
    return this.clientService.post(this.API+"?editarSolicitud="+id,datosSolicitud);

  }
  editarSolicitud2(id:any, datosSolicitud:solicitud):Observable<any>{
    return this.clientService.post(this.API+"?editarSolicitud1="+id,datosSolicitud);

  }
  enviarSolicitud(Estado:any):Observable<any>{
    return this.clientService.get(this.API+"?editarSolicitud="+Estado);

  }
  selectProveedor(){
    return this.clientService.get<any[]>(this.API+"?selectProveedor")
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
    return this.fabrica = localStorage.getItem("idFabrica") || '';
  }

  getTipoUsuario(): string {
    return this.tipoUsuario = localStorage.getItem("NombreTipoUser") || '';
  }
  getidUsuario(): string{
    return this.idUser= localStorage.getItem("id_user") || '';
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const API = `${environment.apiUrl}/usuarios`;

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  listar() {
    return this.http.get<any[]>(API, { headers: this.headers() });
  }

  crear(formData: FormData) {
    return this.http.post<any>(API, formData, { headers: this.headers() });
  }

  deshabilitar(id: string) {
    return this.http.delete<any>(`${API}/${id}`, { headers: this.headers() });
  }

  habilitar(id: string) {
    return this.http.post<any>(`${API}/${id}/habilitar`, {}, { headers: this.headers() });
  }

  actualizar(id: string, formData: FormData) {
    return this.http.put<{ mensaje: string; usuario: any }>(
      `${API}/${id}`, formData, { headers: this.headers() }
    );
  }
}
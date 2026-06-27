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

  actualizar(id: string, formData: FormData) {
    return this.http.put<{ mensaje: string; usuario: any }>(
      `${API}/${id}`,
      formData,
      { headers: this.headers() }
    );
  }
}
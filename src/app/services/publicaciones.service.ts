import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const API = `${environment.apiUrl}/publicaciones`;

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  listar(orden: 'fecha' | 'likes' = 'fecha', offset = 0, limit = 5, usuarioId?: string) {
    let params = new HttpParams()
      .set('orden', orden)
      .set('offset', offset.toString())
      .set('limit', limit.toString());
    if (usuarioId) params = params.set('usuarioId', usuarioId);
    return this.http.get<{ publicaciones: any[]; total: number }>(API, {
      headers: this.headers(), params,
    });
  }

  obtener(id: string, commentOffset = 0, commentLimit = 5) {
    const params = new HttpParams()
      .set('commentOffset', commentOffset.toString())
      .set('commentLimit', commentLimit.toString());
    return this.http.get<any>(`${API}/${id}`, { headers: this.headers(), params });
  }

  cargarComentarios(id: string, offset = 0, limit = 5) {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());
    return this.http.get<{ comentarios: any[]; total: number }>(`${API}/${id}/comentarios`, {
      headers: this.headers(), params,
    });
  }

  crear(formData: FormData) {
    return this.http.post<any>(API, formData, { headers: this.headers() });
  }

  eliminar(id: string) {
    return this.http.delete<any>(`${API}/${id}`, { headers: this.headers() });
  }

  darLike(id: string) {
    return this.http.post<any>(`${API}/${id}/like`, {}, { headers: this.headers() });
  }

  quitarLike(id: string) {
    return this.http.delete<any>(`${API}/${id}/like`, { headers: this.headers() });
  }

  comentar(id: string, texto: string) {
    return this.http.post<any>(`${API}/${id}/comentarios`, { texto }, { headers: this.headers() });
  }

  editarComentario(id: string, comentarioId: string, texto: string) {
    return this.http.put<any>(`${API}/${id}/comentarios/${comentarioId}`, { texto }, { headers: this.headers() });
  }
}
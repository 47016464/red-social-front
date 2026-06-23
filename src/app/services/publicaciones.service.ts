import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

const API = 'https://red-social-back-production.up.railway.app/publicaciones';

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
    return this.http.post<any>(
      `${API}/${id}/comentarios`,
      { texto },
      { headers: this.headers() },
    );
  }
}
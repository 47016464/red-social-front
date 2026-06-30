import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const API = `${environment.apiUrl}/estadisticas`;

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  private params(desde?: string, hasta?: string): HttpParams {
    let p = new HttpParams();
    if (desde) p = p.set('desde', desde);
    if (hasta) p = p.set('hasta', hasta);
    return p;
  }

  publicacionesPorUsuario(desde?: string, hasta?: string) {
    return this.http.get<any[]>(`${API}/publicaciones-por-usuario`, {
      headers: this.headers(), params: this.params(desde, hasta),
    });
  }

  comentariosPorTiempo(desde?: string, hasta?: string) {
    return this.http.get<any[]>(`${API}/comentarios-por-tiempo`, {
      headers: this.headers(), params: this.params(desde, hasta),
    });
  }

  comentariosPorPublicacion(desde?: string, hasta?: string) {
    return this.http.get<any[]>(`${API}/comentarios-por-publicacion`, {
      headers: this.headers(), params: this.params(desde, hasta),
    });
  }
}
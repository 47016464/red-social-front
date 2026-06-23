import { Injectable, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";

const API = "http://localhost:3000/auth";

@Injectable({ providedIn: "root" })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient, private router: Router) {}

  private storage = {
    get: (key: string) => this.isBrowser ? localStorage.getItem(key) : null,
    set: (key: string, val: string) => { if (this.isBrowser) localStorage.setItem(key, val); },
    clear: () => { if (this.isBrowser) localStorage.clear(); },
  };

  registro(formData: FormData) {
    return this.http.post<any>(`${API}/registro`, formData);
  }

  login(identifier: string, password: string) {
    return this.http.post<{ token: string; usuario: any }>(`${API}/login`, {
      identifier, password,
    }).pipe(
      tap(res => {
        this.storage.set("token", res.token);
        this.storage.set("usuario", JSON.stringify(res.usuario));
      })
    );
  }

  logout() {
    this.storage.clear();
    this.router.navigate(["/login"]);
  }

  getToken(): string | null { return this.storage.get("token"); }

  getUsuario(): any {
    const u = this.storage.get("usuario");
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean { return !!this.getToken(); }
}
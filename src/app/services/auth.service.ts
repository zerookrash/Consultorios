import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { isNullOrUndefined } from "util";

import { UserInterface } from "../models/user-interface";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}
  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  registerUser( rol: string, realm: string, username: string, password: string, email: string, especialidad: string, telefono: string, consultorio:string, contrato: string, expira: Date, alta: Date ) {
    let accessToken = localStorage.getItem("accessToken");
    const url_api = `http://134.209.76.197:4001/api/cat_usuarios?access_token=${accessToken}`;
    return this.http
      .post<UserInterface>(
        url_api,
        {
          rol,
          especialidad,
          telefono,
          consultorio,
          contrato,
          expira,
          alta,
          realm,
          username,
          email,
          password
        },
        { headers: this.headers }
      )
      .pipe(map(data => data));
  }

  loginuser(username: string, password: string): Observable<any> {
    const url_api = "http://134.209.76.197:4001/api/cat_usuarios/login?include=user";
    const data = { username, password };
    return this.http
      .post<UserInterface>(
        url_api,
        data
      )
      .pipe(map(data => data));
  }

  setUser(user: UserInterface): void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  setToken(token): void {
    localStorage.setItem("accessToken", token);
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getCurrentUser(): UserInterface {
    let user_string = localStorage.getItem("currentUser");
    if (!isNullOrUndefined(user_string)) {
      let user: UserInterface = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }

  logoutUser() {
    let accessToken = localStorage.getItem("accessToken");
    const url_api = `http://134.209.76.197:4001/api/cat_usuarios/logout?access_token=${accessToken}`;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    return this.http.post<UserInterface>(url_api, { headers: this.headers });
  }
}
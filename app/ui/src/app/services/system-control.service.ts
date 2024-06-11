import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemControlService {

  private apiUrl = 'http://localhost:3000';  // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  stopSystem(): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop`, {});
  }

  resumeSystem(): Observable<any> {
    return this.http.post(`${this.apiUrl}/resume`, {});
  }
}

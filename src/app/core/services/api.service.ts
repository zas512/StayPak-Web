import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {}

  private getHeaders(includeAuth = true): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (includeAuth) {
      const token = this.storage.getItem('accessToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  get<T>(endpoint: string, params?: any, includeAuth = true): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          if (Array.isArray(params[key])) {
            params[key].forEach((val: any) => {
              httpParams = httpParams.append(key, val);
            });
          } else {
            httpParams = httpParams.set(key, params[key]);
          }
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(includeAuth),
      params: httpParams,
    });
  }

  post<T>(endpoint: string, body: any, includeAuth = true): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(includeAuth),
    });
  }

  patch<T>(endpoint: string, body: any, includeAuth = true): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(includeAuth),
    });
  }

  put<T>(endpoint: string, body: any, includeAuth = true): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders(includeAuth),
    });
  }

  delete<T>(endpoint: string, includeAuth = true): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(includeAuth),
    });
  }

  upload<T>(endpoint: string, file: File, fieldName = 'file', additionalData?: any): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }
    const token = this.storage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, { headers });
  }
}
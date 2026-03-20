import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getTip(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tip`)
  }

  getNetwork(): Observable<any> {
    return this.http.get(`${this.baseUrl}/network`)
  }

  getBlocks(count = 20): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/blocks?count=${count}`)
  }

  getBlock(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/block/${id}`)
  }

  getAddress(addr: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/address/${addr}`)
  }

  getTx(txid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tx/${txid}`)
  }

  search(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`)
  }
}

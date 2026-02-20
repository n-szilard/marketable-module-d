import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatResponse } from '../interfaces/chatResponse';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) {}

  apiUrl = 'http://localhost:3000/api'

  login(loginData: Login): boolean {

    const body = new HttpParams()
  .set('username', loginData.username)
  .set('password', loginData.password);

    this.http.post('http://localhost:3000/login', body.toString(), {
      observe: 'response',
      mode: 'cors',
      headers:  {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).subscribe({
      next: (res) => {
        console.log(res);
        if (res.body != null && !res.body.toString().includes('Username and/or password invalid')) {
          return true;
        }
        return false;
      },
      error: (error) => {
        console.log(error);
        return false;
      }
    })
    return false;
  }

  startConversation(token: string, prompt: string): Observable<ChatResponse> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-TOKEN': token
    });
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat/conversation`, { prompt }, { headers });
  }
  
  continueConversation(token: string, conversationId: string, prompt: string): Observable<ChatResponse> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-TOKEN': token
    });
    return this.http.put<ChatResponse>(`${this.apiUrl}/chat/conversation/${conversationId}`, { prompt }, { headers });
  }
  
  getConversation(token: string, conversationId: string): Observable<ChatResponse> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'X-API-TOKEN': token
    });
  
    return this.http.get<ChatResponse>(
      `${this.apiUrl}/chat/conversation/${conversationId}`,
      { headers }
    );
  }

  uploadFile(token: string, file: FormData) {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'X-API-TOKEN': token
    });

    return this.http.post(this.apiUrl + '/imagerecognition/recognize', file, { headers })
  }
}

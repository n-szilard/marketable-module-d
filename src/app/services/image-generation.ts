import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';

export interface JobResponse {
  job_id: string;
}

export interface JobStatus {
  status: 'pending' | 'processing' | 'finished' | 'failed';
  progress: number;
  image_url: string;
}

export interface JobResult {
  resource_id: string;
  image_url: string;
}

@Injectable({ providedIn: 'root' })
export class ImageGenerationService {

  private readonly apiBase = '/api/imagegeneration';
  private readonly apiToken = '13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6';

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-TOKEN': this.apiToken
    });
  }

  constructor(private http: HttpClient) {}

  generate(textPrompt: string): Observable<JobResponse> {
    return this.http.post<JobResponse>(
      `${this.apiBase}/generate`,
      { text_prompt: textPrompt },
      { headers: this.headers }
    );
  }

  getStatus(jobId: string): Observable<JobStatus> {
    return this.http.get<JobStatus>(
      `${this.apiBase}/status/${jobId}`,
      { headers: this.headers }
    );
  }

  getResult(jobId: string): Observable<JobResult> {
    return this.http.get<JobResult>(
      `${this.apiBase}/result/${jobId}`,
      { headers: this.headers }
    );
  }

  upscale(resourceId: string): Observable<JobResponse> {
    return this.http.post<JobResponse>(
      `${this.apiBase}/upscale`,
      { resource_id: resourceId },
      { headers: this.headers }
    );
  }

  zoomIn(resourceId: string): Observable<JobResponse> {
    return this.http.post<JobResponse>(
      `${this.apiBase}/zoom/in`,
      { resource_id: resourceId },
      { headers: this.headers }
    );
  }

  zoomOut(resourceId: string): Observable<JobResponse> {
    return this.http.post<JobResponse>(
      `${this.apiBase}/zoom/out`,
      { resource_id: resourceId },
      { headers: this.headers }
    );
  }

  pollStatus(jobId: string, intervalMs = 2000): Observable<JobStatus> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getStatus(jobId)),
      takeWhile(s => s.status !== 'finished' && s.status !== 'failed', true)
    );
  }
}
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageGenerationService, JobStatus } from '../../services/image-generation';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-generation.html',
  styleUrls: ['./image-generation.scss']
})
export class ImageGeneratorComponent {

  prompt = '';
  loading = false;
  status: JobStatus | null = null;
  errorMsg = '';
  currentJobId = '';
  currentResourceId = '';
  imageUrl = '';

  constructor(
    private imgService: ImageGenerationService,
    private cdr: ChangeDetectorRef  // ← ez az új
  ) {}

  get progressPercent(): number {
    return this.status?.progress ?? 0;
  }

  get statusText(): string {
    const map: Record<string, string> = {
      pending: 'Generálás folyamatban...',
      processing: 'Generálás folyamatban...',
      finished: 'Kész!',
      failed: 'Sikertelen'
    };
    return this.status ? (map[this.status.status] ?? this.status.status) : '';
  }

  generate(): void {
    if (!this.prompt.trim() || this.loading) return;
    this.reset();
    this.loading = true;

    this.imgService.generate(this.prompt).subscribe({
      next: (res) => { this.currentJobId = res.job_id; this.startPolling(); },
      error: (err) => this.handleError(err)
    });
  }

  upscale(): void  { this.runAction(() => this.imgService.upscale(this.currentResourceId)); }
  zoomIn(): void   { this.runAction(() => this.imgService.zoomIn(this.currentResourceId)); }
  zoomOut(): void  { this.runAction(() => this.imgService.zoomOut(this.currentResourceId)); }

  private runAction(fn: () => any): void {
    this.loading = true;
    this.imageUrl = '';
    this.errorMsg = '';
    fn().subscribe({
      next: (res: any) => { this.currentJobId = res.job_id; this.startPolling(); },
      error: (err: any) => this.handleError(err)
    });
  }

  private startPolling(): void {
    this.imgService.pollStatus(this.currentJobId).subscribe({
      next: (s: JobStatus) => {
        this.status = s;
        if (s.status === 'finished') {
          this.imageUrl = s.image_url.replace('http://localhost:3000', '');
          this.loading = false;
          this.fetchResourceId();
        } else if (s.status === 'failed') {
          this.loading = false;
          this.errorMsg = 'A generálás sikertelen.';
        }
        this.cdr.detectChanges(); // ← frissíti a nézetet minden státusz változásnál
      },
      error: (err: any) => this.handleError(err)
    });
  }

  private fetchResourceId(): void {
    this.imgService.getResult(this.currentJobId).subscribe({
      next: (r) => { this.currentResourceId = r.resource_id; },
      error: (err) => console.warn('Result endpoint hiba:', err)
    });
  }

  private reset(): void {
    this.status = null;
    this.imageUrl = '';
    this.errorMsg = '';
    this.currentJobId = '';
    this.currentResourceId = '';
  }

  private handleError(err: any): void {
    this.loading = false;
    this.errorMsg = err?.error?.detail || err?.error?.message || 'Váratlan hiba történt.';
    this.cdr.detectChanges();
    console.error(err);
  }
}
import { Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-image-recognition',
  imports: [FileUploadModule, ButtonModule],
  templateUrl: './image-recognition.html',
  styleUrl: './image-recognition.scss',
})
export class ImageRecognition implements OnInit {

  private token: string | null = '';

  constructor(private router: Router, private api: ApiService) {
    const navigation = this.router.currentNavigation();
    const state = navigation?.extras.state as { token: any };
  
    this.token = state?.token;
  }  


  ngOnInit(): void {
    console.log(this.token);
  }


  onUpload(event: FileUploadEvent) {

    if (this.token == null) {
      return;
    }


    const formData = new FormData();

    formData.append('image', event.files[0]);

    this.api.uploadFile(this.token, formData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


}

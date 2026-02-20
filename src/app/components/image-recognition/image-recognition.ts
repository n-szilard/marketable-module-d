import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-recognition',
  imports: [],
  templateUrl: './image-recognition.html',
  styleUrl: './image-recognition.scss',
})
export class ImageRecognition {

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { token: any };
  
    console.log(state?.token);
  }  
}

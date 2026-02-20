import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent {
  messages = [
    { role: 'assistant', content: 'Szia! Miben segíthetek?' }
  ];
  
  userInput = '';
  
  sendMessage() {
    if (!this.userInput.trim()) return;
  
    this.messages.push({
      role: 'user',
      content: this.userInput
    });
  
    // TODO: backend hívás ide
  
    this.userInput = '';
  }
}

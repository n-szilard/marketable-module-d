import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AfterViewChecked, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent implements AfterViewChecked {

  @ViewChild('chatBody') private chatBody!: ElementRef;

  messages = [
    { role: 'assistant', content: 'Szia! Miben segíthetek?' }
  ];

  userInput = '';

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({
      role: 'user',
      content: this.userInput
    });

    this.userInput = '';
  }

  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    } catch {}
  }
} 
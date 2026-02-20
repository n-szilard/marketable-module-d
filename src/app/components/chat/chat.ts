import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service'; // igazítsd az útvonalat

@Component({
  selector: 'app-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  messages: { role: 'user' | 'assistant'; content: string }[] = [
    { role: 'assistant', content: 'Szia! Miben segíthetek?' }
  ];

  userInput = '';
  loading = false;

  private conversationId: string | null = null;

  // token: nálad lehet máshonnan, de legegyszerűbb:
  private token = localStorage.getItem('token') ?? '';

  constructor(private api: ApiService) {}

  sendMessage() {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', content: text });
    this.userInput = '';
    this.loading = true;

    const handleResponse = (res: any) => {
      // ⚠️ Itt lehet, hogy át kell nevezni a mezőket a te backend válasza szerint
      const reply = res.reply ?? res.message ?? res.response ?? '';
      const cid = res.conversation_id ?? res.conversationId ?? res.id ?? null;

      if (!this.conversationId && cid) this.conversationId = cid;

      this.messages.push({
        role: 'assistant',
        content: reply || 'Nem jött válasz.'
      });

      this.loading = false;
    };

    const handleError = () => {
      this.messages.push({
        role: 'assistant',
        content: 'Hiba történt az AI hívásnál.'
      });
      this.loading = false;
    };

    // 1) ha még nincs conversation -> start
    if (!this.conversationId) {
      this.api.startConversation(this.token, text).subscribe({
        next: handleResponse,
        error: handleError
      });
      return;
    }

    // 2) ha van conversation -> continue
    this.api.continueConversation(this.token, this.conversationId, text).subscribe({
      next: handleResponse,
      error: handleError
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const el = this.chatBody?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
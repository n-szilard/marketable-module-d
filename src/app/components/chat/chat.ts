import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  private token: string = '';

  constructor(
    private router: Router,
    private api: ApiService,
    private message: MessageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = (navigation?.extras.state as { token?: string }) || {};
    this.token = state.token ?? '';
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    if (!this.token) {
      this.message.add({
        severity: 'error',
        summary: 'Hiba',
        detail: 'Hiányzó token, lépj be újra.'
      });
      return;
    }

    this.messages.push({ role: 'user', content: text });
    this.userInput = '';
    this.loading = true;

    const token = this.token;

    const onSuccess = (res: any) => {
      const cid = res.conversation_id ?? res.conversationId ?? res.id ?? null;
      if (!this.conversationId && cid) this.conversationId = cid;

      const reply = res.reply ?? res.message ?? res.response ?? res.text ?? '';
    
      if (reply && String(reply).trim().length > 0) {
        this.messages.push({ role: 'assistant', content: String(reply) });
        this.loading = false;
        return;
      }

      if (this.conversationId) {
        this.pollUntilReady(this.token, this.conversationId);
        return;
      }
    
      this.messages.push({ role: 'assistant', content: 'Nem jött válasz.' });
      this.loading = false;
    };

    const onError = () => {
      this.messages.push({ role: 'assistant', content: 'Hiba történt az AI hívásnál.' });
      this.loading = false;
    };

    // 1) start 
    if (!this.conversationId) {
      this.api.startConversation(token, text).subscribe({ next: onSuccess, error: onError });
      return;
    }

    // 2) continue (PUT)
    const cid = this.conversationId;
    this.api.continueConversation(token, cid, text).subscribe({ next: onSuccess, error: onError });
  }

  private pollUntilReady(token: string, conversationId: string) {
    const intervalMs = 800;
  
    const tick = () => {
      this.api.getConversation(token, conversationId).subscribe({
        next: (res: any) => {
          const status = (res.status ?? res.state ?? '').toString().toLowerCase();
  
          const reply =
            res.reply ??
            res.message ??
            res.response ??
            res.text ??
            res.answer ??
            res.result ??
            '';
  
          if (status && (status === 'ready' || status === 'done' || status === 'finished' || status === 'complete')) {
            this.messages.push({ role: 'assistant', content: String(reply || 'Kész.') });
            this.loading = false;
            return;
          }
  
          if (!status && reply && String(reply).trim().length > 0) {
            this.messages.push({ role: 'assistant', content: String(reply) });
            this.loading = false;
            return;
          }
  
          setTimeout(tick, intervalMs);
        },
        error: () => {
          this.messages.push({ role: 'assistant', content: 'Hiba történt a válasz lekérése közben.' });
          this.loading = false;
        }
      });
    };
  
    setTimeout(tick, intervalMs);
  }
  private pollUntilFinal(token: string, conversationId: string) {
    const intervalMs = 600;
  
    const tick = () => {
      this.api.getConversation(token, conversationId).subscribe({
        next: (res: any) => {
          const partial = res.response ?? '';       // ✅ a te meződ
          const isFinal = !!res.is_final;           // ✅ a te meződ
  
          // ha van rész-válasz, frissítsük / írjuk ki
          // Egyszerűen: csak a végén írjuk ki.
          if (isFinal) {
            this.messages.push({
              role: 'assistant',
              content: partial && partial.trim().length ? partial : 'Nem jött válasz.'
            });
            this.loading = false;
            return;
          }
  
          // még nem kész → próbáljuk újra
          setTimeout(tick, intervalMs);
        },
        error: () => {
          this.messages.push({ role: 'assistant', content: 'Hiba történt a válasz lekérése közben.' });
          this.loading = false;
        }
      });
    };
  
    setTimeout(tick, intervalMs);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const el = this.chatBody?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
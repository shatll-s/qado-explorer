import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private router: Router) {}

  onSearch(query: string) {
    const q = query.trim()
    if (!q) return

    // Numeric — block height
    if (/^\d+$/.test(q)) {
      this.router.navigate(['/block', q])
      return
    }

    // 64 hex — could be address, block hash, or txid
    if (/^[0-9a-fA-F]{64}$/.test(q)) {
      // Starts with zeros — likely block hash
      if (q.startsWith('0000')) {
        this.router.navigate(['/block', q.toLowerCase()])
      } else {
        this.router.navigate(['/address', q.toLowerCase()])
      }
      return
    }

    // Fallback — try block
    this.router.navigate(['/block', q])
  }
}

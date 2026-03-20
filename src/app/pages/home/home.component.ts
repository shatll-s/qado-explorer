import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { ApiService } from '../../services/api.service'
import { forkJoin } from 'rxjs'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  tip: any = null
  network: any = null
  health: any = null
  blocks: any[] = []
  loading = true
  private refreshTimer: any

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData()
    this.refreshTimer = setInterval(() => this.loadData(), 15000)
  }

  ngOnDestroy() {
    if (this.refreshTimer) clearInterval(this.refreshTimer)
  }

  loadData() {
    forkJoin({
      tip: this.api.getTip(),
      network: this.api.getNetwork(),
      health: this.api.getNodeHealth(),
      blocks: this.api.getBlocks(20)
    }).subscribe({
      next: ({ tip, network, health, blocks }) => {
        this.tip = tip
        this.network = network
        this.health = health
        this.blocks = blocks
        this.loading = false
        this.cdr.markForCheck()
      },
      error: () => {
        this.loading = false
        this.cdr.markForCheck()
      }
    })
  }

  formatAmount(atomic: string | number): string {
    const n = typeof atomic === 'string' ? parseInt(atomic) : atomic
    return (n / 1_000_000_000).toFixed(4)
  }

  shortenHash(hash: string): string {
    if (!hash || hash.length <= 20) return hash
    return hash.substring(0, 10) + '...' + hash.slice(-8)
  }

  timeAgo(timestamp: string | number): string {
    if (!timestamp) return ''
    let unix: number
    if (typeof timestamp === 'string' && timestamp.includes('T')) {
      unix = Math.floor(new Date(timestamp).getTime() / 1000)
    } else {
      const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
      unix = ts > 1e12 ? Math.floor(ts / 1000) : ts
    }
    const diff = Math.floor(Date.now() / 1000) - unix
    if (diff < 0) return 'just now'
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }
}

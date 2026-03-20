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
  stats: any = null
  blocks: any[] = []
  loading = true
  hoveredMiner: string | null = null
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
      stats: this.api.getStats(),
      blocks: this.api.getBlocks(20)
    }).subscribe({
      next: ({ tip, network, health, stats, blocks }) => {
        this.tip = tip
        this.network = network
        this.health = health
        this.stats = stats
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

  onMinerHover(miner: string | null) {
    this.hoveredMiner = miner
    this.cdr.markForCheck()
  }

  formatAmount(atomic: string | number): string {
    const n = typeof atomic === 'string' ? parseInt(atomic) : atomic
    return (n / 1_000_000_000).toFixed(4)
  }

  formatHashrate(h: number): string {
    if (h >= 1e12) return (h / 1e12).toFixed(2) + ' TH/s'
    if (h >= 1e9) return (h / 1e9).toFixed(2) + ' GH/s'
    if (h >= 1e6) return (h / 1e6).toFixed(2) + ' MH/s'
    if (h >= 1e3) return (h / 1e3).toFixed(2) + ' KH/s'
    return h.toFixed(0) + ' H/s'
  }

  formatDifficulty(d: number): string {
    if (d >= 1e12) return (d / 1e12).toFixed(2) + ' T'
    if (d >= 1e9) return (d / 1e9).toFixed(2) + ' G'
    if (d >= 1e6) return (d / 1e6).toFixed(2) + ' M'
    if (d >= 1e3) return (d / 1e3).toFixed(2) + ' K'
    return d.toFixed(0)
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

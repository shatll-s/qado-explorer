import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { ApiService } from '../../services/api.service'

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
  blocks: any[] = []
  loading = true
  private refreshTimer: any

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData()
    this.refreshTimer = setInterval(() => this.loadData(), 15000)
  }

  ngOnDestroy() {
    if (this.refreshTimer) clearInterval(this.refreshTimer)
  }

  loadData() {
    this.api.getTip().subscribe(tip => this.tip = tip)
    this.api.getNetwork().subscribe(net => this.network = net)
    this.api.getBlocks(20).subscribe(blocks => {
      this.blocks = blocks
      this.loading = false
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
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
    // Qado timestamps are in ticks or unix — detect
    const unix = ts > 1e12 ? Math.floor(ts / 1000) : ts
    const diff = Math.floor(Date.now() / 1000) - unix
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  address = ''
  info: any = null
  error: string | null = null
  allTxs: any[] = []
  nextCursor: string | null = null
  loadingTxs = false
  displayCount = 20

  constructor(private route: ActivatedRoute, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.address = params['addr']
      this.allTxs = []
      this.nextCursor = null
      this.displayCount = 20
      this.loadAddress()
      this.loadIncoming()
    })
  }

  get visibleTxs() {
    return this.allTxs.slice(0, this.displayCount)
  }

  get hasMore() {
    return this.displayCount < this.allTxs.length || !!this.nextCursor
  }

  loadAddress() {
    this.error = null
    this.api.getAddress(this.address).subscribe({
      next: info => { this.info = info; this.cdr.markForCheck() },
      error: err => { this.error = err.error?.error || 'Address not found'; this.cdr.markForCheck() }
    })
  }

  loadIncoming(cursor?: string) {
    this.loadingTxs = true
    this.api.getAddressIncoming(this.address, cursor).subscribe({
      next: data => {
        this.allTxs.push(...(data.items || data.transactions || []))
        this.nextCursor = data.next_cursor ? data.next_cursor : null
        this.loadingTxs = false
        this.cdr.markForCheck()
      },
      error: () => { this.loadingTxs = false; this.cdr.markForCheck() }
    })
  }

  showMore() {
    this.displayCount += 20
    if (this.displayCount >= this.allTxs.length && this.nextCursor) {
      this.loadIncoming(this.nextCursor)
    }
  }

  formatAmount(atomic: string | number): string {
    const n = typeof atomic === 'string' ? parseInt(atomic) : atomic
    return (n / 1_000_000_000).toFixed(9)
  }

  shortenHash(hash: string): string {
    if (!hash) return ''
    return hash.substring(0, 6) + '...' + hash.slice(-4)
  }

  timeAgo(ts: string): string {
    if (!ts) return ''
    const diff = (Date.now() - new Date(ts).getTime()) / 1000
    if (diff < 60) return `${Math.floor(diff)}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }
}

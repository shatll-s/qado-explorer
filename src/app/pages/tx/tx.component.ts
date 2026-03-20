import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-tx',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tx.component.html',
  styleUrl: './tx.component.scss'
})
export class TxComponent implements OnInit {
  txid = ''
  info: any = null
  error: string | null = null

  constructor(private route: ActivatedRoute, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.txid = params['txid']
      this.loadTx()
    })
  }

  loadTx() {
    this.error = null
    this.api.getTx(this.txid).subscribe({
      next: info => { this.info = info; this.cdr.markForCheck() },
      error: err => { this.error = err.error?.error || 'Transaction not found'; this.cdr.markForCheck() }
    })
  }

  formatAmount(atomic: string | number): string {
    const n = typeof atomic === 'string' ? parseInt(atomic) : atomic
    return (n / 1_000_000_000).toFixed(9)
  }

  formatTimestamp(ts: string): string {
    if (!ts) return ''
    return new Date(ts).toLocaleString()
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-block',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './block.component.html',
  styleUrl: './block.component.scss'
})
export class BlockComponent implements OnInit {
  block: any = null
  error: string | null = null
  blockId = ''
  tipHeight = 0

  constructor(private route: ActivatedRoute, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getTip().subscribe({
      next: tip => { this.tipHeight = parseInt(tip.height); this.cdr.markForCheck() }
    })
    this.route.params.subscribe(params => {
      this.blockId = params['id']
      this.loadBlock()
    })
  }

  loadBlock() {
    this.block = null
    this.error = null
    this.cdr.markForCheck()
    this.api.getBlock(this.blockId).subscribe({
      next: block => { this.block = block; this.cdr.markForCheck() },
      error: err => { this.error = err.error?.error || 'Block not found'; this.cdr.markForCheck() }
    })
  }

  get blockHeight(): number {
    return this.block ? parseInt(this.block.height) : 0
  }

  get hasPrev(): boolean {
    return this.blockHeight > 0
  }

  get hasNext(): boolean {
    return this.blockHeight < this.tipHeight
  }

  formatAmount(atomic: string | number): string {
    const n = typeof atomic === 'string' ? parseInt(atomic) : atomic
    return (n / 1_000_000_000).toFixed(4)
  }

  formatTimestamp(ts: string): string {
    if (!ts) return ''
    return new Date(ts).toLocaleString()
  }
}

import { Component, OnInit } from '@angular/core'
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

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.blockId = params['id']
      this.loadBlock()
    })
  }

  loadBlock() {
    this.error = null
    this.api.getBlock(this.blockId).subscribe({
      next: block => this.block = block,
      error: err => this.error = err.error?.error || 'Block not found'
    })
  }

  formatAmount(atomic: string | number): string {
    const n = typeof atomic === 'string' ? parseInt(atomic) : atomic
    return (n / 1_000_000_000).toFixed(4)
  }
}

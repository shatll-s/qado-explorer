import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-tx',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tx.component.html',
  styleUrl: './tx.component.scss'
})
export class TxComponent implements OnInit {
  txid = ''
  info: any = null
  error: string | null = null

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.txid = params['txid']
      this.loadTx()
    })
  }

  loadTx() {
    this.error = null
    this.api.getTx(this.txid).subscribe({
      next: info => this.info = info,
      error: err => this.error = err.error?.error || 'Transaction not found'
    })
  }
}

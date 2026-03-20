import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  address = ''
  info: any = null
  error: string | null = null

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.address = params['addr']
      this.loadAddress()
    })
  }

  loadAddress() {
    this.error = null
    this.api.getAddress(this.address).subscribe({
      next: info => this.info = info,
      error: err => this.error = err.error?.error || 'Address not found'
    })
  }

  formatAmount(atomic: string | number): string {
    const n = typeof atomic === 'string' ? parseInt(atomic) : atomic
    return (n / 1_000_000_000).toFixed(9)
  }
}

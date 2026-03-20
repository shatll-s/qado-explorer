import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'block/:id', loadComponent: () => import('./pages/block/block.component').then(m => m.BlockComponent) },
  { path: 'address/:addr', loadComponent: () => import('./pages/address/address.component').then(m => m.AddressComponent) },
  { path: 'tx/:txid', loadComponent: () => import('./pages/tx/tx.component').then(m => m.TxComponent) },
  { path: '**', redirectTo: '' }
];

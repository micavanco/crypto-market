import { Routes } from '@angular/router';
import { OrdersPage } from '@features/orders';

export const routes: Routes = [
  {
    path: '',
    component: OrdersPage
  },
  {
    path: 'new-order',
    loadComponent: () => import('@features/new-order').then(m => m.NewOrderPage),
  },
  {
    path: '**',
    redirectTo: '',
  }
];

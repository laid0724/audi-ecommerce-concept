import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsCategoryListComponent } from './products-category-list/products-category-list.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { ProductsListComponent } from './products-list/products-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'categories',
  },
  {
    path: 'categories',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ProductsCategoryListComponent,
      },
      {
        path: 'new',
        component: ProductsCategoryListComponent,
      },
      {
        path: ':categoryId',
        component: ProductsCategoryListComponent,
      },
    ],
  },
  {
    path: 'items',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ProductsListComponent,
      },
      {
        path: 'new',
        component: ProductsEditComponent,
      },
      {
        path: ':productId',
        component: ProductsEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}

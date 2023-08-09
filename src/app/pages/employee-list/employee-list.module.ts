import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeListPageRoutingModule } from './employee-list-routing.module';

import { EmployeeListPage } from './employee-list.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeListPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [EmployeeListPage]
})
export class EmployeeListPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmployeeListPageRoutingModule } from './employee-list-routing.module';
import { EmployeeListPage } from './employee-list.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SearchModalComponent } from 'src/app/search-modal/search-modal.component';
import { ThousandSeparatorDirective } from 'src/app/search-modal/thousand-seperator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeListPageRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
  ],
  declarations: [EmployeeListPage, SearchModalComponent, ThousandSeparatorDirective]
})
export class EmployeeListPageModule {}

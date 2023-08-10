import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/database.service';
import { SearchModalComponent } from 'src/app/search-modal/search-modal.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {

  constructor(
    private modalController: ModalController, 
    private route: ActivatedRoute,
    private alertController: AlertController,
    private databaseService: DatabaseService) { }

  employees: any[] = [];
  columns: any[] = [];
  filterInfo: string = '';

 async ngOnInit() {

  this.columns = [
    { prop: 'id' },
    { prop: 'employeeName' },
    { prop: 'dob' },
    { prop: 'departmentName' },
    { prop: 'position' },
    { prop: 'salary' },
    { prop: 'nrc' },
  
  ];
  await this.databaseService.initializeDatabase();
    this.fetchEmployees();
    
  }

  async fetchEmployees() {
    this.employees = await this.databaseService.getAllEmployees();
    this.updateSequentialNumbers(this.employees);
   
  }

  

  async confirmDelete(user: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              this.deleteUser(user);
              this.presentSuccessAlert();
            } catch (error) {
              console.error('Error deleting user:', error);
              this.presentErrorAlert();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  updateSequentialNumbers(employees: any[]) {
    employees.forEach((employee, index) => {
      employee.sequentialNumber = index + 1;
    });

  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'User deleted successfully!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'An error occurred while deleting the user.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async deleteUser(user: any) {
    
    try {
      await this.databaseService.deleteUser(user.id);
      this.fetchEmployees();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }




  async openModal(){
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        mode: 'search' // Initialize your filter object here
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'search') {
        const filteredEmployees = result.data.filteredEmployees; // Get the filtered employees from the modal
        this.employees = filteredEmployees; // Update the employees list with the filtered results
        console.log("Filter By: filteredEmployees", JSON.stringify(filteredEmployees));
        const searchCriteria = result.data.formData;
        this.updateFilterInfo(searchCriteria); 
        this.updateSequentialNumbers(filteredEmployees);
      }
    });

    return await modal.present();
  }

  updateFilterInfo(searchCriteria: any) {
    const filterParts = [];
  
    if (searchCriteria.employeeName !== "") {
      filterParts.push(searchCriteria.employeeName);
    }
    if (searchCriteria.departmentName !== "") {
      filterParts.push(searchCriteria.departmentName);
    }
    if (searchCriteria.position !== "") {
      filterParts.push(searchCriteria.position);
    }
  
    this.filterInfo = filterParts.join(', ');
  }

  async openInsertModal() {
    await this.databaseService.initializeDatabase();
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        mode: 'insert',
      },
    });

    modal.onDidDismiss().then((result) =>{
      if(result.data && result.data.role === 'insert'){
        console.log("Insert OK modal Dismiss");
        this.fetchEmployees();
        
      }
    });

    return await modal.present();


  }

  async openUpdateModal(employee: any) {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        mode: 'update',
        employeeData: employee
      },
    });

    modal.onDidDismiss().then((result) =>{
      if(result.data && result.data.role === 'update'){
        console.log("update OK modal dismiss");
        this.fetchEmployees();
        
      }
    })
    return await modal.present();
  }

}

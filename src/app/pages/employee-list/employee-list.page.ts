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
    this.route.queryParams.subscribe(params => {
      if (params['newEmployeeAdded']) {
        this.fetchEmployees();
      }
    });
  }

  async fetchEmployees() {
    this.employees = await this.databaseService.getAllEmployees();
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
        const filteredEmployees = result.data; // Get the filtered employees from the modal
        this.employees = filteredEmployees; // Update the employees list with the filtered results
        console.log("The employee inside onDidDismiss in list page: ", this.employees);
      }
    });

    return await modal.present();
  }

  async openInsertModal() {
    await this.databaseService.initializeDatabase();
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: {
        mode: 'insert',
      },
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
    return await modal.present();
  }

}

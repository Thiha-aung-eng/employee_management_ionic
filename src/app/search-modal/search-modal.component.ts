import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent  implements OnInit {
  @Input() mode: 'insert' | 'update' | 'search' = 'search';
  @Input() employeeData: any;

  @Output() searchButtonClicked = new EventEmitter<any>();
  
  modalTitle: string = '';
  form!: FormGroup;
  formSubmitted = false;
  employees!: any[];

  constructor(private modalController: ModalController,
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    ) { 
      this.form = this.formBuilder.group({
        employeeName: ['', Validators.required],
      departmentName: ['', Validators.required],
      dateOfBirth: [null],
      position: ['', Validators.required],
      nrc: [''],
      salary: [''],
      });
    }

  ionViewWillEnter() {
    if (this.mode === 'insert') {
      this.modalTitle = 'Insert New Employee';
     
    } else if (this.mode === 'update') {
      this.modalTitle = 'Update Employee Information';
     
    } else if (this.mode === 'search') {
      this.modalTitle = 'Search Employee';
     
    }
  }

  ngOnInit() {
    if (this.mode === 'update' && this.employeeData) {
      // Pre-populate the form fields with existing employee data
      this.form.patchValue(this.employeeData);
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

  async showInsertSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: [{
        text: 'ok',
        handler: async () => {
          await this.databaseService.getAllEmployees();
        },
      },],
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

  async submitForm() {
   
    if (this.mode === 'insert') {
      this.formSubmitted = true;
      if(this.form.valid){
        this.formSubmitted = false;
        await this.databaseService.insertEmployee(this.form.value);
        this.showInsertSuccessAlert('Employee inserted successfully!');
        this.closeModal();
      }      
    } else if (this.mode === 'update') {
      const updatedEmployee = { ...this.employeeData, ...this.form.value };
      const success = await this.databaseService.editEmployee(updatedEmployee);
      if (success) {
        this.showInsertSuccessAlert('Updated Successfully!');
        this.closeModal();
      } else {
        this.presentErrorAlert(); // Show error alert if update failed
      }
    } else if (this.mode === 'search') {
      
      const searchCriteria = this.form.value;
      console.log("Search Form Data: "+this.form.value.employeeName);
      const filteredEmployees = await this.databaseService.searchEmployees(searchCriteria);
      this.searchButtonClicked.emit(filteredEmployees); // Emit the filtered employees
      this.modalController.dismiss(filteredEmployees, 'search');
    }
  }

}

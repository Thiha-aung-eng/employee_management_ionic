import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database!: SQLiteObject;

  constructor(private sqlite: SQLite) { }
  async initializeDatabase() {
    try {

      if (!this.sqlite) {
        console.error('SQLite plugin not available.');
        return;
      }

      
      this.database = await this.sqlite.create({
        name: 'employees',
        location: 'default',
      });

     
      await this.database.executeSql(
        'CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, employeeName TEXT, departmentName TEXT, dateOfBirth TEXT, position TEXT, nrc TEXT, salary REAL)',
        []
      );
    } catch (error) {
      console.error('Error initializing database', error);
    }
  }

  async insertEmployee(employee: any) {
    try {
      await this.database.executeSql(
        'INSERT INTO employees (employeeName, departmentName, dateOfBirth, position, nrc, salary) VALUES (?, ?, ?, ?, ?, ?)',
        [
          employee.employeeName,
          employee.departmentName,
          employee.dateOfBirth,
          employee.position,
          employee.nrc,
          employee.salary,
        ]
      );
      console.log("insert successful");
    } catch (error) {
      console.error('Error inserting employee', error);
    }
  }

  async getAllEmployees() {
    try {
      const result = await this.database.executeSql('SELECT * FROM employees', []);
      const employees = [];
      for (let i = 0; i < result.rows.length; i++) {
        employees.push(result.rows.item(i));
      }
      return employees;
    } catch (error) {
      console.error('Error fetching employees', error);
      return [];
    }
  }

  async getEmployeeById(employeeId: number): Promise<any> {
    const db = await this.sqlite.create({
      name: 'employees.db',
      location: 'default'
    });

    try {
      const query = `SELECT * FROM employees WHERE id = ?`;
      const result = await db.executeSql(query, [employeeId]);

      if (result.rows.length > 0) {
        const employeeData = result.rows.item(0);
        return employeeData;
      } else {
        throw new Error('Employee not found');
      }
    } catch (error) {
      console.error('Error fetching employee by ID:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await this.database.executeSql('DELETE FROM employees WHERE id = ?', [userId]);
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting user:', error);
      return Promise.reject(error);
    }
  }

  async editEmployee(updatedEmployee: any): Promise<boolean> {
    try {
      const db = await this.sqlite.create({
        name: 'employees',
        location: 'default',
      });
  
      await db.executeSql(
        'UPDATE employees SET employeeName = ?, departmentName = ?, dateOfBirth = ?, position = ?, nrc = ?, salary = ? WHERE id = ?',
        [
          updatedEmployee.employeeName,
          updatedEmployee.departmentName,
          updatedEmployee.dateOfBirth,
          updatedEmployee.position,
          updatedEmployee.nrc,
          updatedEmployee.salary,
          updatedEmployee.id,
        ]
      );
  
      return true; // Successful update
    } catch (error) {
      console.error('Error editing employee:', error);
      return false; // Error during update
    }
  }

  async searchEmployees(searchCriteria: any): Promise<any[]> {
    try {
      let query = 'SELECT * FROM employees WHERE 1=1'; // Start with a basic query
      const queryParams = [];
  
      // Build the query based on search criteria
      if (searchCriteria.employeeName !=="") {
        query += ' AND employeeName LIKE ?';
        queryParams.push(`%${searchCriteria.employeeName}%`);
      }
      if (searchCriteria.departmentName !=="") {
        query += ' AND departmentName LIKE ?';
        queryParams.push(`${searchCriteria.departmentName}%`);
      }
      if (searchCriteria.position !=="") {
        query += ' AND position LIKE ?';
        queryParams.push(`${searchCriteria.position}%`);
      }
      if (searchCriteria.nrc !=="") {
        query += ' AND nrc = ?';
        queryParams.push(searchCriteria.nrc);
      }
    
      const result = await this.database.executeSql(query, queryParams);
    
      const employees = [];
      for (let i = 0; i < result.rows.length; i++) {
        employees.push(result.rows.item(i));
      }
    
      return employees;
    } catch (error) {
      console.error('Error searching employees:', error);
      return [];
    }
  }
  
  
}

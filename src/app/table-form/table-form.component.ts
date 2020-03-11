import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, ValidatorFn, FormArray } from '@angular/forms';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.css']
})
export class TableFormComponent implements OnInit, AfterViewInit {
  userForm: FormGroup;
  tableData = [{
    name: 'Ravindra Devkhile',
    email: 'ravidev@gmail.com',
    dateFrom: '12/03/2001',
    dateTo: '12/03/2001',
    mobNumber: 9860643587
  }, {
    name: 'Ravindra Devkhile1',
    email: 'ravidev1@gmail.com',
    dateFrom: '12/03/2001',
    dateTo: '12/03/2000',
    mobNumber: 'ravidevkhile'
  }]

  tableHeader=[{
    fieldName: 'name',
    header: 'Name',
    validator: ['required']
  }, {
    fieldName: 'email',
    header: 'Email',
    validator: ['required', 'emailValidator',]
  },
  {
    fieldName: 'dateFrom',
    header: 'From Date',
    validator: ['required']
  }, {
    fieldName: 'dateTo',
    header: 'To Date',
    validator: ['required']
  }, {
    fieldName: 'mobNumber',
    header: 'Mobile Number',
    validator: ['required','numberValidator']
  }];
  constructor(private fb: FormBuilder) {
    
  }
 getUsersList():FormArray
 {
  let users =this.userForm.get('users') as FormArray;
  return users;
 }
  ngOnInit(): void {
    this.userForm = this.fb.group({
      users: this.fb.array([])
    });
    this.tableData.forEach(element => {
      let userdata=this.userForm.get('users') as FormArray;
      let usercontrol=this.initiatForm(element);
      userdata.push(usercontrol);  
    });
    
  }
  ngAfterViewInit():void{
    let users =this.userForm.get('users') as FormArray;
    // this.userForm.markAsDirty()
    users.controls.forEach(userControl => 
       {
        // userControl.markAsDirty();
      this.tableHeader.forEach(element => {
        // userControl.get(element.fieldName).markAsTouched();      
      });  
    });
  }
  initiatForm(dataObj: any): FormGroup {
    let group = {}
    this.tableHeader.forEach(element => {
      group[element.fieldName] = new FormControl(dataObj[element.fieldName],this.getValidations(element));      
    });
    const control = this.fb.group(group);      
    return control;
  }
  getValidations(dataElement: TableHeader): ValidatorFn[] {
    let validators: ValidatorFn[] = [];
    if (dataElement.validator && dataElement.validator.length > 1) {
      dataElement.validator.forEach(validation => {
        if (validation == 'numberValidator') {
          validators.push(this.numberValidator);
        } else if (validation == 'emailValidator') {
          validators.push(Validators.email);
        }
        else if (validation == 'required') {
          validators.push(Validators.required);
        }
      });
    }
    return validators;
  }
  numberValidator(c: AbstractControl): { [key: string]: boolean } | null {
    if (c.pristine) {
      return null;
    }
    if (c.value.match(/.*[^0-9].*/)) {
      return { 'numeric': true };
    }
    return null;
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Date from should be less than Date to"
        };
      }
      return {};
    }
  }
}
export class TableHeader {
  fieldName: string;
  header: string;
  validator: string[];
}
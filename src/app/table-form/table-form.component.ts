import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, ValidatorFn, FormArray } from '@angular/forms';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.css']
})
export class TableFormComponent implements OnInit {
  userForm: FormGroup;
  tableData: {
    name: string;
    email: string,
    dateFrom: string,
    dateTo: string,
    mobNumber: any
  }[] = [{
    name: 'Ravindra Devkhile',
    email: 'ravidevkhile@gmail.com',
    dateFrom: '12/03/2001',
    dateTo: '12/03/2001',
    mobNumber: 9860643587
  }, {
    name: 'Ravindra Devkhile1',
    email: 'ravidevkhile1@gmail.com',
    dateFrom: '12/03/2001',
    dateTo: '12/03/2000',
    mobNumber: 'ravidevkhile'
  }]

  tableHeader: TableHeader[];
  constructor(private fb: FormBuilder) {
    this.tableHeader = [{
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
      validator: ['required,dateLessThan("dateTo","dateFrom")']
    }, {
      fieldName: 'mobNumber',
      header: 'Mobile Number',
      validator: ['required,numberValidator())']
    }]
  }
 getuserControls():FormArray
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
      userdata.push(this.initiatForm(element));  
    });
    
  }
  initiatForm(dataObj: any): FormGroup {
    let group = {}
    this.tableHeader.forEach(element => {
      group[element.fieldName] = new FormControl(dataObj[element.fieldName], this.getValidations(element.validator));
    });
    const control = this.fb.group(group);
    return control;
  }
  getValidations(dataElement: TableHeader): ValidatorFn[] {
    let validators: ValidatorFn[] = [];
    if (dataElement.validator && dataElement.validator.length > 1) {
      var str = new String(dataElement.validator)
      var splits = str.split("|")
      splits.forEach(validation => {
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
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.css']
})
export class TableFormComponent implements OnInit {
  userForm: FormGroup;
  tableHeader:TableHeader[];
  const formControls=[];  
  constructor(private fb: FormBuilder) {
    this.tableHeader=[{
      fieldName:'name',
      header:'Name',
      validator:['required']
    },{
      fieldName:'email',
      header:'Email',
      validator:['required','emailValidator',]
    },
    {
      fieldName:'dateFrom',
      header:'From Date',
      validator:['required']
    },{
      fieldName:'dateTo',
      header:'To Date',
      validator:['required,dateLessThan("dateTo","dateFrom")']
    },{
      fieldName:'mobNumber',
      header:'Mobile Number',
      validator:['required,numberValidator())']
    }]
   }

  ngOnInit(): void {
    // this.userForm = this.fb.group({      
    //   users: this.fb.array([])
    // });
    
    this.userForm = this.fb.group({      
      users: this.fb.array([])
    });
  }
  initiatForm(): FormGroup {
    return this.fb.group({
      name: ['',],
      email: ['',],
      dateTo: ['',],
      dateFrom: [''],
      mobNumber: ['']
    });
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
export class TableHeader{
fieldName:string;
header:string;
validator:string[];
}
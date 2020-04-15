import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IEvent } from 'src/app/interfaces/ievent';
import { EventService } from 'src/app/services/event.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialog implements OnInit {
  myForm: FormGroup;
  dateDisabled: boolean = true;
  random_part_of_link: String = "";
  selectedMoment; minDate = new Date();


  constructor(private dialogRef: MatDialogRef<NewEventDialog>, private eventService: EventService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    var timestamp = new Date().getTime();
    var random = Math.floor((Math.random() * 1000000000) + 1);
    this.random_part_of_link = timestamp + "" + random;

    this.reactiveForm(this.random_part_of_link);
  }

  reactiveForm(random: String) {
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      date: [{ value: '', disabled: true }, [Validators.required]],
      link: [{ value: random, disabled: true }],
      fixDate: ['']
    })
  }

  fixDateChanged() {
    this.dateDisabled = !this.dateDisabled;
    if (this.dateDisabled) {
      this.myForm.get("date").disable();
    } else {
      this.myForm.get("date").enable();
    }
  }

  nameChanged(newValue) {
    this.myForm.get('link').setValue(encodeURIComponent(newValue.target.value).concat(this.random_part_of_link.toString()));
  }

  createEvent() {
    console.log(this.myForm);
    if (!this.myForm.invalid) {
      let event: IEvent = {
        id: null,
        name: this.myForm.get('name').value,
        description: this.myForm.get('description').value,
        accesstoken: this.myForm.get('link').value,
        start_date: null,
        end_date: null,
        flexible_time: this.dateDisabled,
      }
      if (!event.flexible_time) {
        event.start_date = this.myForm.get('date').value[0]
        event.end_date = this.myForm.get('date').value[1]
      }

      this.eventService.addEvent(event)
        .then(data => this.dialogRef.close(event))
        .catch(error => console.log(error));
    }
  }

  /* Handle form errors in Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  }

}

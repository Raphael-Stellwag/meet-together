import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { IEvent } from 'src/app/interfaces/ievent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  event: IEvent = {} as IEvent
  myForm: FormGroup;
  dateDisabled: boolean = true;
  random_part_of_link: String = "";
  minDate = new Date();
  oldLink: String = null;

  constructor(private actRoute: ActivatedRoute, private formBuilder: FormBuilder, private eventService: EventService) { }

  ngOnInit(): void {
    var timestamp = new Date().getTime();
    var random = Math.floor((Math.random() * 1000000000) + 1);
    this.random_part_of_link = timestamp + "" + random;
    this.reactiveForm(this.random_part_of_link);

    let event_id;
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      console.log(element);
      if (element.params.id != undefined && element.params.id != null) {
        console.log(element.params.id);
        event_id = element.params.id;
      }
    })
    console.log(event_id)
    this.eventService.getEvent(event_id).then((event) => {
      this.event = event;
      let date: Date[] = [event.start_date, event.end_date]
      this.myForm.get("name").setValue(event.name);
      this.myForm.get("description").setValue(event.description);
      this.myForm.get("fixDate").setValue(!event.flexible_time);
      this.myForm.get("date").setValue(date);
      this.myForm.get("link").setValue(event.accesstoken);

      if (event.flexible_time == false) {
        this.fixDateButtonPressed();
      }
    })
  }

  reactiveForm(random: String) {
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      date: [{ value: '', disabled: true }, [Validators.required]],
      link: [{ value: random, disabled: true }],
      fixDate: [''],
      updateLink: ['']
    })
  }

  fixDateButtonPressed() {
    if (this.myForm.get("date").enabled) {
      this.myForm.get("date").disable();
    } else {
      this.myForm.get("date").enable();
    }
  }

  updateInvitationLink() {
    if (this.myForm.value.updateLink) {
      this.nameChanged(this.myForm.value.name)
    } else {
      this.myForm.get("link").setValue(this.event.accesstoken);
    }
  }

  nameChanged(newValue) {
    if (this.myForm.value.updateLink) {
      this.myForm.get('link').setValue(encodeURIComponent(newValue).concat(this.random_part_of_link.toString()));
    }
  }

  updateEvent() {
    console.log(this.myForm);
    if (!this.myForm.invalid) {
      let event: IEvent = {
        id: this.event.id,
        name: this.myForm.get('name').value,
        description: this.myForm.get('description').value,
        accesstoken: this.myForm.get('link').value,
        start_date: null,
        end_date: null,
        flexible_time: !this.myForm.get("date").enabled,
      }
      if (!event.flexible_time) {
        event.start_date = this.myForm.get('date').value[0]
        event.end_date = this.myForm.get('date').value[1]
      }

      this.eventService.updateEvent(event)
        .then(data => /*this.dialogRef.close(event)*/{

        })
        .catch(error => console.log(error));
    }
  }

  /* Handle form errors in Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  }


}

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { IEvent } from 'src/app/interfaces/ievent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { ITimePlaceSuggestion } from 'src/app/interfaces/itime-place-suggestion';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-edit-event',
  templateUrl: './create-edit-event.component.html',
  styleUrls: ['./create-edit-event.component.scss']
})
export class CreateEditEventComponent implements OnInit {
  event: IEvent = {} as IEvent
  myForm: FormGroup;
  dateDisabled: boolean = true;
  minDate = new Date();
  @Input() isUpdateView: boolean = false;
  @Output() callback = new EventEmitter<Object>();
  @ViewChild("hiddenButton") button;

  constructor(private actRoute: ActivatedRoute, private formBuilder: FormBuilder, private eventService: EventService) { }

  ngOnInit(): void {;
    this.reactiveForm();

    if (this.isUpdateView) {
      let event_id;
      this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
        if (element.params.id != undefined && element.params.id != null) {
          event_id = element.params.id;
        }
      })
      this.eventService.getEvent(event_id).then((event) => {
        this.reactiveForm();
        this.event = event;
        this.myForm.get("name").setValue(event.name);
        this.myForm.get("description").setValue(event.description);

        if (event.start_date != null) {
          let date: Date[] = [event.start_date, event.end_date]
          this.myForm.get("date").setValue(date);
          this.myForm.get("location").setValue(event.place);
          this.myForm.get("location_link").setValue(event.link);
          this.myForm.get("timePlaceSettings").setValue("2");
          this.timePlaceSettingsChanged({ value: 2 });
        } else {
          this.myForm.get("timePlaceSettings").setValue("0");
          this.myForm.get("date").disable();
        }
      })
    } else {
      this.myForm.get("timePlaceSettings").setValue("0");
      this.myForm.get("date").disable();
    }
  }

  reactiveForm() {
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      date: [{ value: '', }, [Validators.required]],
      location: [{ value: '', disabled: true }],
      location_link: [{ value: '', disabled: true }],
      updateLink: [''],
      timePlaceSettings: ['']
    })
  }

  timePlaceSettingsChanged(timePlaceSettings) {
    if (timePlaceSettings.value == 1 || timePlaceSettings.value == 2) {
      this.myForm.get("date").enable();
      this.myForm.get("location").enable();
      this.myForm.get("location_link").enable();
    } else {
      this.myForm.get("date").disable();
      this.myForm.get("location").disable();
      this.myForm.get("location_link").disable();
    }
  }

  triggerCallback() {
    if (!this.myForm.invalid && (this.myForm.get("timePlaceSettings").value == 0 || this.myForm.get('date').value[0] instanceof Date)) {
      let eventWithTimePlaceSuggestion = this.getFormFieldInputAsReturnableObject();
      this.callback.emit(eventWithTimePlaceSuggestion);
    }
  }

  clickCreateButton(): void {
    let event = new MouseEvent('click', { bubbles: true });
    this.button.nativeElement.dispatchEvent(event);
  }

  private getFormFieldInputAsReturnableObject() {
    let event: IEvent = {
      id: null,
      name: this.myForm.get('name').value,
      description: this.myForm.get('description').value,
      accesstoken: null,
      start_date: null,
      end_date: null,
      place: null,
      link: null
    }

    if (this.isUpdateView) {
      event.id = this.event.id;
    }

    let timePlaceSuggestion: ITimePlaceSuggestion = null;
    let timePlaceSettings = this.myForm.get("timePlaceSettings").value;

    if (timePlaceSettings == '2') {
      event.start_date = this.myForm.get('date').value[0];
      event.end_date = this.myForm.get('date').value[1];
      event.place = this.myForm.get('location').value;
      event.link = this.myForm.get('location_link').value;
    } else if (timePlaceSettings == '1') {
      timePlaceSuggestion = {
        start_date: this.myForm.get('date').value[0],
        end_date: this.myForm.get('date').value[1],
        place: this.myForm.get('location').value,
        link: this.myForm.get('location_link').value
      }
    }

    return { event: event, timePlaceSuggestion: timePlaceSuggestion };
  }

  /* Handle form errors in Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  }
}

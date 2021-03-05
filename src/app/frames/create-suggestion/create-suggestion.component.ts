import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ITimePlaceSuggestion} from "../../interfaces/itime-place-suggestion";

@Component({
  selector: 'app-create-suggestion',
  templateUrl: './create-suggestion.component.html',
  styleUrls: ['./create-suggestion.component.scss']
})
export class CreateSuggestionComponent implements OnInit {
  myForm: FormGroup;
  minDate = new Date();
  @ViewChild("hiddenButton") button;
  @Output() callback = new EventEmitter<Object>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      date: [{ value: '', }, [Validators.required]],
      location: [],
      location_link: []
    })
  }

  triggerCallback() {
    if (!this.myForm.invalid && this.myForm.get('date').value[0] instanceof Date) {
      let timePlaceSuggestion = this.getFormFieldInputAsReturnableObject();
      if (timePlaceSuggestion.place == "") {
        timePlaceSuggestion.place = null;
      }
      if (timePlaceSuggestion.link == "") {
        timePlaceSuggestion.link = null;
      }
      this.callback.emit(timePlaceSuggestion);
    }
  }

  submitForm(): void {
    let event = new MouseEvent('click', { bubbles: true });
    this.button.nativeElement.dispatchEvent(event);
  }

  private getFormFieldInputAsReturnableObject(): ITimePlaceSuggestion {
    return  {
      start_date: this.myForm.get('date').value[0],
      end_date: this.myForm.get('date').value[1],
      place: this.myForm.get('location').value,
      link: this.myForm.get('location_link').value
    }
  }

  /* Handle form errors in Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  }
}

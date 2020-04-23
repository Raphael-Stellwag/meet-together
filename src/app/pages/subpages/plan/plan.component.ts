import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { ITimePlaceSuggestion } from 'src/app/interfaces/itime-place-suggestion';
import { OutputWriterService } from 'src/app/services/output-writer.service';
import { UserService } from 'src/app/services/user.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { IParticipant } from 'src/app/interfaces/iparticipant';
import { IEvent } from 'src/app/interfaces/ievent';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  timePlaceSuggestions: ITimePlaceSuggestion[] = [];
  //resultTimePlaceSuggestions: ITimePlaceSuggestion[] = [];
  event_id: number;
  user_id: number;
  step = 0;
  creator: boolean;
  isResultView = false;
  choosen_id = null;

  constructor(private actRoute: ActivatedRoute, private eventService: EventService, public outputWriter: OutputWriterService, private userService: UserService) {

  }

  ngOnInit(): void {
    this.user_id = this.userService.getUserId();
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      if (element.params.id != undefined && element.params.id != null) {
        this.event_id = Number(element.params.id);
      }
    })
    let event = this.eventService.internalGetEvent(this.event_id);
    if (event == null) {
      this.eventService.notifyWhenGotEvents()
        .then(() => {
          event = this.eventService.internalGetEvent(this.event_id);
          this.initView(event)
        })
    } else {
      this.initView(event);
    }
  }

  initView(event) {
    this.creator = event.creator;
    this.choosen_id = event.choosen_time_place;
    if (this.creator) {
      this.filteredParticipants = this.participantsCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allParticipants.slice()));
    }

    this.eventService.getTimePlaceSuggestions(this.event_id)
      .then((data: ITimePlaceSuggestion[]) => {
        this.timePlaceSuggestions = data;
        console.log(data);
        if (this.creator) {
          this.setAllParticipants();
          this.calculateScore();
          //this.setResultSuggestionsByRelevance(data)
        }
      })
      .catch((err) => console.error(err))
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  togglePressed($event, suggestion) {
    console.log($event, suggestion);
    let suggestion_id = Number(suggestion.id);
    if ($event.checked) {
      this.eventService.addUserToTimePlaceSuggestion(this.event_id, suggestion_id)
        .then((new_suggestion: ITimePlaceSuggestion) => {
          suggestion.can_attend = new_suggestion.can_attend;
        })
    } else {
      this.eventService.removeUserFromTimePlaceSuggestion(this.event_id, suggestion_id)
        .then((new_suggestion: ITimePlaceSuggestion) => {
          suggestion.can_attend = new_suggestion.can_attend;
        })
    }
  }

  canAttend(suggestion) {
    let return_value = false;
    suggestion.can_attend.forEach(attendee => {
      if (attendee.id == this.user_id) {
        return_value = true;
      }
    });
    return return_value;
  }

  suggestionAdded(data: ITimePlaceSuggestion) {
    this.timePlaceSuggestions.push(data)
    //this.resultTimePlaceSuggestions.push(data)
  }

  showResultsTogglePressed($event) {
    this.isResultView = !this.isResultView
  }


  setAllParticipants() {
    this.timePlaceSuggestions.forEach((suggestion) => {
      suggestion.can_attend.forEach((participant: IParticipant) => {
        if (!this.allParticipants.some(arrayParticipant => arrayParticipant.id == participant.id)) {
          console.log(participant);
          this.allParticipants.push(participant);
        }
      })
    })
  }

  /*
  setResultSuggestionsByRelevance(suggestions: ITimePlaceSuggestion[]) {
    this.resultTimePlaceSuggestions = [];
    suggestions.forEach((suggestion) => {
      let tmp = {
        score: (suggestion.can_attend.length / this.allParticipants.length),
        id: suggestion.id,
        start_date: suggestion.start_date,
        end_date: suggestion.end_date,
        place: suggestion.place,
        link: suggestion.link,
        can_attend: []
      }
      console.log(tmp);
      suggestion.can_attend.forEach((participant: IParticipant) => {
        tmp.can_attend.push({ id: participant.id, name: participant.name })
      })
      this.resultTimePlaceSuggestions.push(tmp);
    });
    this.sortResultSuggestions();
  }

  sortResultSuggestions() {
    this.resultTimePlaceSuggestions.sort((a, b) => b.score - a.score);
  }*/

  countImportantParticipantsCanAttend(suggestion) {
    var count = 0;
    this.importantParticipants.forEach((participant) => {
      suggestion.can_attend.forEach((participantCanAttend) => {
        if (participantCanAttend.id == participant.id) {
          count++;
        }
      })
    })
    return count;
  }

  countParticipantsCanAttend(suggestion) {
    return suggestion.can_attend.length;
  }

  calculateScore() {
    this.timePlaceSuggestions.forEach((suggestion) => {
      suggestion.score = (suggestion.can_attend.length / this.allParticipants.length)
      this.importantParticipants.forEach((participant: IParticipant) => {
        if (suggestion.can_attend.some(participantsInSuggestion => participantsInSuggestion.id == participant.id)) {
          suggestion.score++;
        }
      })
    })
    //this.sortResultSuggestions();
  }

  suggestionChoosen(suggestion) {
    this.eventService.suggestionChoosen(this.event_id, suggestion.id)
      .then((result: IEvent) => {
        console.log(result);
        let i = result;
        this.choosen_id = result.choosen_time_place;
        //TODO
      })
  }


  //THE FOLLOWING SECTION HANDLES THE MAT-CHIP-AUTOCOMPLETE TO CHOOSE important Participants
  separatorKeysCodes: number[] = [ENTER, COMMA];
  participantsCtrl = new FormControl();
  @ViewChild('participantInput') participantInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  filteredParticipants: Observable<IParticipant[]>;
  importantParticipants: IParticipant[] = [];
  allParticipants: IParticipant[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    console.log(event.value);

    let participantHits = this.allParticipants.filter((participant: IParticipant) => {
      return participant.name.toLowerCase().startsWith(value.toLowerCase().trim())
    });

    if (participantHits.length == 1) {
      this.importantParticipants.push(participantHits[0]);
      this.calculateScore();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.participantsCtrl.setValue(null);
  }

  remove(participant: IParticipant): void {
    const index = this.importantParticipants.indexOf(participant);

    if (index >= 0) {
      this.importantParticipants.splice(index, 1);
      this.calculateScore();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.importantParticipants.push(event.option.value);
    this.calculateScore();
    this.participantInput.nativeElement.value = '';
    this.participantsCtrl.setValue(null);
  }

  private _filter(value: any): IParticipant[] {
    if (value instanceof Object) {
      return [value];
    }
    const filterValue = value.toLowerCase();

    return this.allParticipants.filter(participant => participant.name.toLowerCase().indexOf(filterValue) === 0);
  }

}

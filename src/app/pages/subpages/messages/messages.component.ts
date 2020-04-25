import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { IMessage } from 'src/app/interfaces/imessage';
import { EMessageGenerated } from 'src/app/enums/emessage-generated.enum';
import { HelperFunctionsService } from 'src/app/services/helper-functions.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: IMessage[] = [];

  constructor(private actRoute: ActivatedRoute, private messageService: MessagesService, private helperFunctions: HelperFunctionsService) { }

  ngOnInit(): void {
    let event_id = null;
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      console.log(element);
      if (element.params.id != undefined && element.params.id != null) {
        console.log(element.params.id);
        event_id = element.params.id;
      }
    })
    this.messageService.getMessages(event_id)
      .then(messages => {
        this.messages = messages;
      })
  }

  ngOnDestroy(): void {
    this.messageService.destroy();
  }

  printGeneratedMessage(msg: IMessage) {
    let content: any = JSON.parse(msg.content);
    let return_value = "";
    switch (msg.generated_content_description) {
      case EMessageGenerated.event_created: {
        return_value = msg.user_name + " has created the event " + content.name;
        break;
      }
      case EMessageGenerated.user_joined_event: {
        return_value = msg.user_name + " has joined the event";
        break;
      }
      case EMessageGenerated.event_updated: {
        return_value = "Event was updated. New details under details";
        break;
      }
      case EMessageGenerated.time_place_suggestion_added: {
        return_value = msg.user_name + " has suggested to meet at " + this.helperFunctions.printDate(this.helperFunctions.jsonDateToJsDate(content).start_date);
        break;
      }
      case EMessageGenerated.time_place_suggestion_choosen: {
        return_value = msg.user_name + " has choosen to meet at " + this.helperFunctions.printDate(this.helperFunctions.jsonDateToJsDate(content).start_date);
        break;
      }
      case EMessageGenerated.user_left_event: {
        return_value = msg.user_name + " has left the event.";
        break;
      }
      default: {
        throw new Error("unknown generated_content_description");
      }
    }
    return return_value;
  }

}

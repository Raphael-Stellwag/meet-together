import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { IMessage } from 'src/app/interfaces/imessage';
import { EMessageGenerated } from 'src/app/enums/emessage-generated.enum';
import { HelperFunctionsService } from 'src/app/services/helper-functions.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: IMessage[] = [];
  message: string;
  event_id;
  user_id;

  constructor(private actRoute: ActivatedRoute, private messageService: MessagesService,
              private helperFunctions: HelperFunctionsService, private userService: UserService) {

  }

  ngOnInit(): void {
    this.user_id = this.userService.getUserId();
    this.messages = this.actRoute.snapshot.data.messageData;
    this.event_id = this.messages[0].event_id;
  }

  ngOnDestroy(): void {
    this.messageService.destroy();
  }

  printGeneratedMessage(msg: IMessage) {
    let content: any;
    try {
      content = JSON.parse(msg.content);
    } catch (error) {
      console.log("In generated message was in content no json (maybe ok)")
    }
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

  sendMessage() {
    if (this.message.trim().length > 0) {
      this.messageService.sendMessage(this.event_id, this.message)
        .then(() => this.message = "")
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { IMessage } from 'src/app/interfaces/imessage';
import { EMessageGenerated } from 'src/app/enums/emessage-generated.enum';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: IMessage[] = [];
  event_id

  constructor(private actRoute: ActivatedRoute, private messageService: MessagesService) { }

  ngOnInit(): void {
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      console.log(element);
      if (element.params.id != undefined && element.params.id != null) {
        console.log(element.params.id);
        this.event_id = element.params.id;
      }
    })
    this.messageService.getMessages(this.event_id)
      .then(messages => {
        this.messages = messages;
      })
  }

  ngOnDestroy(): void {
    this.messageService.destroy(this.event_id);
  }

  printGeneratedMessage(msg: IMessage) {
    let content = JSON.parse(msg.content);
    let return_value = "";
    switch (msg.generated_content_description) {
      case EMessageGenerated.event_created: {
        return_value = msg.user_name + " has created the Event " + content.name;
        break;
      }
      case EMessageGenerated.user_joined_event: {
        return_value = msg.user_name + " has joined the Event";
        break;
      }
      default: {
        throw new Error("unknown generated_content_description");
      }
    }
    return return_value;
  }

}

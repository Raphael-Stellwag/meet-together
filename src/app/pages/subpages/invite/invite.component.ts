import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { EventComponent } from '../../event/event.component';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { IParticipant } from 'src/app/interfaces/iparticipant';
import { MatChipInputEvent } from '@angular/material/chips';
import { UserService } from 'src/app/services/user.service';
import { HelperFunctionsService } from 'src/app/services/helper-functions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  accessUrl = "";
  event_id;
  @ViewChild('shareBtn') shareBtn;

  constructor(private actRoute: ActivatedRoute, private emailService: EmailService, private eventService: EventService, private userService: UserService, private helperFunctions: HelperFunctionsService, private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      if (element.params.id != undefined && element.params.id != null) {
        this.event_id = element.params.id;
      }
    })
    console.log(this.event_id)
    this.eventService.getEvent(this.event_id).then((event) => {
      this.accessUrl = window.location.protocol + "//" + window.location.host + "/join-event/" + this.event_id + "?accesstoken=" + event.accesstoken;

      this.subject = this.userService.getUserName() + " invited you to join the Event: " + event.name;
      this.content =
        "Hi, \n" + this.userService.getUserName() + " invited you to join the Event: " + event.name + "\n\n" +
        "Here are some details about the event: \n" +
        "\t- Name: " + event.name + "\n" +
        "\t- Description: " + event.description + "\n";
      if (event.start_date != null) {
        this.content = this.content + "\t- Start: " + this.helperFunctions.printDate(event.start_date);
        if (event.end_date != null) {
          this.content = this.content + " - " + this.helperFunctions.printEndDate(event.end_date, event.start_date);
        }
        this.content = this.content + "\n";
        if (event.place != null) {
          this.content = this.content + "\t- Location: " + event.place + "\n";
        }

        if (event.link != null) {
          this.content = this.content + "\t- More information about the location: " + event.link + " \n";
        }
      }
      this.content = this.content + "\nTo join the event click the following link: " + this.accessUrl + " \n\n";
      this.content = this.content + "Best regards and wishes from the Meet together team"
    })

    this.shareBtn.addEventListener('click', async () => {
      const resultPara = document.querySelector('.result');
      try {
        if ((navigator as any).share) {
          const shareData = {
            title: 'MDN',
            text: 'Learn web development on MDN!',
            url: 'https://developer.mozilla.org',
          }
          await (navigator as any).share(shareData)
          resultPara.textContent = 'MDN shared successfully'
        } else {
          console.error("Not available on this system")
          resultPara.textContent = 'Error: ' + 'not available'
        }
      } catch (err) {
        resultPara.textContent = 'Error: ' + err
      }
    });
  }

  sendEmail() {
    let html5_content = this.content;
    let startpos = 0;
    while (html5_content.indexOf("http", startpos) > 0) {
      let beginn = html5_content.indexOf("http", startpos);
      let end = html5_content.indexOf(" ", beginn);
      let url = html5_content.substring(beginn, end);
      let html5_url = "<a href='" + url + "'> " + url + "</a>";
      startpos = startpos + html5_content.length;
      html5_content = html5_content.replace(url, html5_url);
    }
    html5_content = html5_content.replace(/\n/g, " <br>");
    //html5_content = html5_content.replace(/ /g, "&nbsp");
    html5_content = html5_content.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

    this.emailService.sendEmail(this.event_id, this.recipients, this.subject, html5_content)
      .then((result: any) => {
        if (result.rejected.length == 0) {
          this.snackbar.open("All mails were send", null, {
            duration: 3000,
          });
          this.recipients = [];
        } else {
          this.snackbar.open("Some recipients were not reachable, please check their addresses", null, {
            duration: 3000,
          });
          this.recipients = result.rejected
        }
        console.log(result)
      })
      .catch((err) => console.log(err));
  }


  //THE FOLLOWING SECTION HANDLES THE MAT-CHIP-AUTOCOMPLETE TO CHOOSE important Participants
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  recipientsCtrl = new FormControl();
  @ViewChild('recipientInput') recipientInput: ElementRef<HTMLInputElement>;
  recipients: String[] = [];
  subject;
  content: String;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    console.log(event.value);

    let regexp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    if (regexp.test(value)) {
      this.recipients.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.recipientsCtrl.setValue(null);
  }

  remove(email: String): void {
    const index = this.recipients.indexOf(email);

    if (index >= 0) {
      this.recipients.splice(index, 1);
    }
  }


}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AddJoinButtonComponent } from './frames/add-join-button/add-join-button.component';
import { NewUserDialog } from './dialogs/new-user-dialog/new-user-dialog.component';
import { TopBarComponent } from './frames/top-bar/top-bar.component';
import { EventComponent } from './pages/event/event.component';
import { NewEventDialog } from './dialogs/new-event-dialog/new-event-dialog.component';
import { HomeComponent } from './pages/home/home.component';
import { SideNavBarComponent } from './frames/side-nav-bar/side-nav-bar.component';
import { MessagesComponent } from './pages/subpages/messages/messages.component';
import { PlanComponent } from './pages/subpages/plan/plan.component';
import { DetailsComponent } from './pages/subpages/details/details.component';
import { EditComponent } from './pages/subpages/edit/edit.component';
import { ParticipantsComponent } from './pages/subpages/participants/participants.component';
import { JoinEventComponent } from './pages/join-event/join-event.component';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import { InviteComponent } from './pages/subpages/invite/invite.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserMenuComponent } from './frames/user-menu/user-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';


import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/AuthInterceptor';


@NgModule({
  declarations: [
    AppComponent,
    AddJoinButtonComponent,
    NewUserDialog,
    TopBarComponent,
    UserMenuComponent,
    EventComponent,
    NewEventDialog,
    HomeComponent,
    SideNavBarComponent,
    MessagesComponent,
    PlanComponent,
    DetailsComponent,
    EditComponent,
    ParticipantsComponent,
    JoinEventComponent,
    MessageDialogComponent,
    InviteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatBadgeModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatListModule,
    MatSidenavModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    MatMenuModule,
    MatSelectModule,
    OwlDateTimeModule,
    HttpClientModule,
    OwlNativeDateTimeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'de' }, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

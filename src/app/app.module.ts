import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AddEventButtonComponent } from './frames/add-event-button/add-event-button.component';
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
import { UserMenuComponent } from './frames/user-menu/user-menu.component';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { CreateEditEventComponent } from './frames/create-edit-event/create-edit-event.component';
import { SortByPipe } from "./pipes/SortByPipe";


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { AddSuggestionButtonComponent } from './frames/add-suggestion-button/add-suggestion-button.component';
import { NewSuggestionDialog } from './dialogs/new-suggestion-dialog/new-suggestion-dialog.component';
import { CreateSuggestionComponent } from './frames/create-suggestion/create-suggestion.component';
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserNameDialog } from './dialogs/update-user-name-dialog/update-user-name-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    AddEventButtonComponent,
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
    InviteComponent,
    CreateEditEventComponent,
    AddSuggestionButtonComponent,
    NewSuggestionDialog,
    CreateSuggestionComponent,
    SortByPipe,
    UpdateUserNameDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OwlDateTimeModule,
    HttpClientModule,
    OwlNativeDateTimeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'de' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AuthGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

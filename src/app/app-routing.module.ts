import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { MessagesComponent } from './pages/subpages/messages/messages.component';
import { PlanComponent } from './pages/subpages/plan/plan.component';
import { DetailsComponent } from './pages/subpages/details/details.component';
import { EditComponent } from './pages/subpages/edit/edit.component';
import { ParticipantsComponent } from './pages/subpages/participants/participants.component';
import { JoinEventComponent } from './pages/join-event/join-event.component';
import { InviteComponent } from './pages/subpages/invite/invite.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'join-event/:id', component: JoinEventComponent, canActivate: [AuthGuard] },
  {
    path: 'event/:id', component: EventComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      { path: 'messages', component: MessagesComponent },
      { path: 'plan', component: PlanComponent },
      { path: 'details', component: DetailsComponent },
      { path: 'edit', component: EditComponent },
      { path: 'participants', component: ParticipantsComponent },
      { path: 'invite', component: InviteComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

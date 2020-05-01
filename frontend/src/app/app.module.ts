import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { GroupcreateComponent } from './groupcreate/groupcreate.component';
import { GroupdisplayComponent } from './groupdisplay/groupdisplay.component';
import { PremeetingComponent } from './premeeting/premeeting.component';
import { ScheduleComponent } from './schedule/schedule.component';
import {TheboardComponent} from "./theboard/theboard.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    LoginComponent,
    ProfileComponent,
    GroupcreateComponent,
    GroupdisplayComponent,
    PremeetingComponent,
    ScheduleComponent,
    TheboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

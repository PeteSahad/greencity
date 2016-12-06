import { ChallengeItemComponent } from './../components/challenge-item/challenge-item';
import { EcoHeaderComponent } from './../components/eco-header/eco-header';
import { DailytippProvider } from './../providers/dailytipp-provider';
import { RankingPage } from './../pages/ranking/ranking';
import { ProgressbarComponent } from './../components/progressbar/progressbar';
import { ChallengeDetailPage } from './../pages/challenge-detail/challenge-detail';
import { Object2array } from './../pipes/object2array';
import { StatisticsPage } from './../pages/statistics/statistics';
import { StatsProvider } from './../providers/stats-provider';
import { ApiProvider } from './../providers/api-provider';
import { WelcomeSliderComponent } from './../components/welcome-slider/welcome-slider';
import { ReminderService } from './../providers/reminder-service';
import { MapPage } from './../pages/map/map';
import { MapComponent } from './../components/map/map';
import { Stopwatch } from './../pipes/stopwatch';
import { PositionComponent } from './../components/position/position';
import { LocationTracker } from './../providers/location-tracker';
import { TrackingComponent } from './../components/tracking/tracking';
import { CouponDetailPage } from './../pages/coupon-detail/coupon-detail';
import { CouponProvider } from './../providers/coupon-provider';
import { CouponsPage } from './../pages/coupons/coupons';
import { ChallengeProvider } from './../providers/challenge-provider';
import { CameraComponent } from './../components/camera/camera';
import { CategoryProvider } from './../providers/category-provider';
import { AuthProvider } from './../providers/auth-provider';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { ChartModule } from 'ng2-chartjs2';
// import services
import {PostService} from '../services/post-service';
import {UserService} from '../services/user-service';
import {NotificationService} from '../services/notification-service';
import {ChatService} from '../services/chat-service';
// end import services
// import pages
import { ChatDetailPage} from '../pages/chat-detail/chat-detail';
import { ChatsPage} from '../pages/chats/chats';
import { HomePage} from '../pages/home/home';
import { LoginPage} from '../pages/login/login';
import { NotificationsPage} from '../pages/notifications/notifications';
import { PostPage} from '../pages/post/post';
import { RecentPostsPage} from '../pages/recent-posts/recent-posts';
import { RegisterPage} from '../pages/register/register';
import { SettingPage} from '../pages/setting/setting';
import { UserPage} from '../pages/user/user';
import { ChallengesPage} from '../pages/challenges/challenges';

// end import pages

//import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  declarations: [
    MyApp,
    ChatDetailPage,
    ChatsPage,
    CouponsPage,
    CouponDetailPage,
    HomePage,
    LoginPage,
    NotificationsPage,
    MapPage,
    PostPage,
    RecentPostsPage,
    RegisterPage,
    SettingPage,
    WelcomeSliderComponent,
    UserPage,
    ChallengesPage,
    ChallengeDetailPage,
    CameraComponent,
    TrackingComponent,
    PositionComponent,
    MapComponent,
    Stopwatch,
    Object2array,
    StatisticsPage,
    ProgressbarComponent,
    RankingPage,
    EcoHeaderComponent,
    ChallengeItemComponent,
    
],
  imports: [
    IonicModule.forRoot(MyApp),   
    ChartModule,
    
    /**AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzXT3w21lVFijawEkfd9mG4za9gTNV-yQ'
    }) */
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChatDetailPage,
    ChatsPage,
    CouponsPage,
    CouponDetailPage,
    HomePage,
    LoginPage,
    NotificationsPage,
    PostPage,
    RecentPostsPage,
    RegisterPage,
    SettingPage,
    MapPage,
    UserPage,
    ChallengesPage,
    ChallengeDetailPage,
    CameraComponent,
    TrackingComponent,
    PositionComponent,
    WelcomeSliderComponent,
    StatisticsPage,
    RankingPage,
    EcoHeaderComponent
],
  providers: [
    PostService,
    AuthProvider,
    CouponProvider,
    CategoryProvider,
    ChallengeProvider,
    UserService,
    NotificationService,
    ChatService,
    LocationTracker,
    ReminderService,
    ApiProvider,
    StatsProvider,
    DailytippProvider
]
})
export class AppModule {}

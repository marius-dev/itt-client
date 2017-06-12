import {Component, OnInit, OnDestroy, ViewChild, HostListener, ViewEncapsulation} from '@angular/core';
import {MenuItems} from '../core/menu/menu-items/menu-items';
import {BreadcrumbService} from '../core/breadcrumb/breadcrumb.service';
import {PageTitleService} from '../core/page-title/page-title.service';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import * as Ps from 'perfect-scrollbar';


const screenfull = require('screenfull');

@Component({
  selector: 'app-layout',
  templateUrl: './main-material.html',
  styleUrls: ['./main-material.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {

  private _router: Subscription;
  header: string;
  currentLang = 'en';
  url: string;
  showSettings = false;
  dark: boolean;
  boxed: boolean;
  collapseSidebar: boolean;
  compactSidebar: boolean;
  customizerIn: boolean = false;
  root = 'ltr';
  chatpanelOpen: boolean = false;

  private _mediaSubscription: Subscription;
  sidenavOpen: boolean = true;
  sidenavMode: string = 'side';
  isMobile: boolean = false;
  isFullscreen: boolean = false;

  private _routerEventsSubscription: Subscription;

  @ViewChild('sidenav') sidenav;

  constructor(
    public menuItems: MenuItems,
    private breadcrumbService: BreadcrumbService,
    private pageTitleService: PageTitleService,
    public translate: TranslateService,
    private router: Router,
    private media: ObservableMedia
  ) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ro/) ? browserLang : 'en');

    breadcrumbService.addFriendlyNameForRoute('/dashboard', 'Dashboard');
    breadcrumbService.addFriendlyNameForRoute('/session', 'Session');
    breadcrumbService.addFriendlyNameForRoute('/session/login', 'Login');
    breadcrumbService.addFriendlyNameForRoute('/session/forgot-password', 'Forgot');
    breadcrumbService.addFriendlyNameForRoute('/session/lockscreen', 'Lock Screen');
  }

  ngOnInit() {
    this.pageTitleService.title.subscribe((val: string) => {
      this.header = val;
    });

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      this.url = event.url;
    });

    if (this.url !== '/session/login' && this.url !== '/session/forgot-password' && this.url !== '/session/lockscreen') {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar-container ');


      if (window.matchMedia(`(min-width: 960px)`).matches) {
        Ps.initialize(elemSidebar, {wheelSpeed: 2, suppressScrollX: true});

      }
    }

    this._mediaSubscription = this.media.asObservable().subscribe((change: MediaChange) => {
      const isMobile = (change.mqAlias === 'xs') || (change.mqAlias === 'sm');

      this.isMobile = isMobile;
      this.sidenavMode = (isMobile) ? 'over' : 'side';
      this.sidenavOpen = !isMobile;
    });

    this._routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.isMobile) {
        this.sidenav.close();
      }
    });
  }

  ngOnDestroy() {
    this._router.unsubscribe();
    this._mediaSubscription.unsubscribe();
  }

  menuMouseOver(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
      this.sidenav.mode = 'over';
    }
  }

  menuMouseOut(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
      this.sidenav.mode = 'side';
    }
  }

  toggleFullscreen() {
    if (screenfull.enabled) {
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    }
  }

  customizerFunction() {
    this.customizerIn = !this.customizerIn;
  }

  addMenuItem(): void {
    this.menuItems.add({
      state: 'pages',
      name: 'MENU',
      type: 'sub',
      icon: 'trending_flat',
      children: [
        {state: 'blank', name: 'SUB MENU1'},
        {state: 'blank', name: 'SUB MENU2'}
      ]
    });
  }

  onActivate(e, scrollContainer) {
    scrollContainer.scrollTop = 0;
  }

}



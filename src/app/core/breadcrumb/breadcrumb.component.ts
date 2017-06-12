import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbsComponent implements OnInit, OnChanges {

  @Input('prefix')
  prefix: string  = '';

  urls: string[];
  private _routerSubscription: any;

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.urls = [];

    if (this.prefix.length > 0) {
      this.urls.unshift(this.prefix);
    }

    this._routerSubscription = this.router.events.subscribe((navigationEnd:NavigationEnd) => {
      this.urls.length = 0;
      this.apprateBreadcrumbTrail(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  ngOnChanges(): void {
    if (!this.urls) {
      return;
    }

    this.urls.length = 0;
    this.apprateBreadcrumbTrail(this.router.url);
  }

  apprateBreadcrumbTrail(url: string): void {
    if (!this.breadcrumbService.isRouteHidden(url)) {
      this.urls.unshift(url);
    }

    if (url.lastIndexOf('/') > 0) {
      this.apprateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/')));
    } else if (this.prefix.length > 0) {
      this.urls.unshift(this.prefix);
    }
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  friendlyName(url: string): string {
    return !url ? '' : this.breadcrumbService.getFriendlyNameForRoute(url);
  }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var environment_1 = require("../../../environments/environment");
var external_api_routes_1 = require("../../external-api-routes");
var external_api_routes_2 = require("../../external-api-routes");
var date_fns_1 = require("date-fns");
var colors = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};
var ActivityManagerService = (function () {
    function ActivityManagerService(http, authService, translate) {
        var _this = this;
        this.http = http;
        this.authService = authService;
        this.translate = translate;
        this.authService.currentUser().subscribe(function (user) {
            _this.user = user;
        });
        var browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|ro/) ? browserLang : 'en');
    }
    ActivityManagerService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    ActivityManagerService.prototype.getActivitiesOnDate = function (date) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http
            .post(environment_1.environment.coreIttUrl + '/' + external_api_routes_2.studentRoutes.rootApi + '/email', JSON.stringify({ email: this.user.profile.email }), options)
            .toPromise()
            .then(function (res) {
            var student = res.json();
            var dateAsString = date_fns_1.format(date, 'DD-MM-YYYY');
            return _this.http
                .get(environment_1.environment.coreIttUrl + '/' + external_api_routes_1.activityRoutes.activityApi + '/student/' + student.id + '/' + dateAsString, options)
                .toPromise()
                .catch(function (err) {
                return _this.handleError(err);
            });
        })
            .catch(function (err) {
            return _this.handleError(err);
        });
    };
    ActivityManagerService.prototype.activitiesToCalendarObjects = function (serializedActivities, date) {
        var _this = this;
        var events;
        serializedActivities.forEach(function (item, index) {
            events.push(_this.activityToCalendarObject(item, date));
        });
        return events;
    };
    ActivityManagerService.prototype.activityToCalendarObject = function (serializedActivity, date) {
        var startDate = date;
        startDate.setHours(serializedActivity.hour);
        startDate = date_fns_1.addDays(startDate, serializedActivity.day - 1);
        var endDate = date_fns_1.addHours(startDate, serializedActivity.duration);
        console.log(startDate);
        console.log(endDate);
        console.log(serializedActivity);
        var activity = {
            start: startDate,
            end: endDate,
            title: this.translate.instant(serializedActivity.activityCategory) + ' ' + this.translate.instant('at') + ' ' +
                serializedActivity.subject.fullName + ' - ' +
                serializedActivity.teacher.name + ' ' + serializedActivity.teacher.surname,
            color: colors.yellow,
            resizable: {
                beforeStart: false,
                afterEnd: false
            },
            draggable: false
        };
        //console.log(activity);
        return activity;
    };
    return ActivityManagerService;
}());
ActivityManagerService = __decorate([
    core_1.Injectable()
], ActivityManagerService);
exports.ActivityManagerService = ActivityManagerService;

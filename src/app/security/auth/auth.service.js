"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var firebase = require("firebase/app");
var AuthService = (function () {
    function AuthService(afAuth, userService) {
        var _this = this;
        this.afAuth = afAuth;
        this.userService = userService;
        this.authState = null;
        this.afAuth.authState.subscribe(function (auth) {
            _this.authState = auth;
        });
    }
    AuthService.prototype.login = function (email, password) {
        var promise = this.afAuth.auth.signInWithEmailAndPassword(email, password);
        return rxjs_1.Observable.fromPromise(promise);
    };
    AuthService.prototype.currentUser = function () {
        if (this.authenticated === true) {
            return this.userService.getUser(this.currentUserId);
        }
        else {
            return rxjs_1.Observable.of(null);
        }
    };
    AuthService.prototype.isAuthenticated = function (roles) {
        return this.currentUser()
            .switchMap(function (user) {
            return roles ?
                rxjs_1.Observable.of(!!user && roles.indexOf(user.role.name) > -1) :
                rxjs_1.Observable.of(!!user);
        });
    };
    AuthService.prototype.logout = function () {
        var promise = this.afAuth.auth.signOut();
        return rxjs_1.Observable.fromPromise(promise);
    };
    Object.defineProperty(AuthService.prototype, "currentUserObservable", {
        // Returns
        get: function () {
            return this.authenticated ? this.authState : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserId", {
        get: function () {
            return this.authenticated ? this.authState.uid : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserAnonymous", {
        // Anonymous User
        get: function () {
            return this.authenticated ? this.currentUserObservable.isAnonymous : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "authenticated", {
        get: function () {
            return this.authState !== null;
        },
        enumerable: true,
        configurable: true
    });
    // Sends email allowing user to reset password
    AuthService.prototype.resetPassword = function (email) {
        var auth = firebase.auth();
        return auth.sendPasswordResetEmail(email)
            .then(function () { return console.log('email sent'); })
            .catch(function (error) { return console.log(error); });
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable()
], AuthService);
exports.AuthService = AuthService;

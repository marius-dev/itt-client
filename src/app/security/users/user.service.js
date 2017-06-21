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
var firebase = require('firebase');
var environment_1 = require("../../../environments/environment");
var firebaseConfig = environment_1.environment.firebaseConfig;
var UserService = (function () {
    function UserService(afAuth, afDatabase) {
        this.afAuth = afAuth;
        this.afDatabase = afDatabase;
    }
    UserService.prototype.getUsers = function () {
        return this.afDatabase.list('users');
    };
    UserService.prototype.getUser = function ($key) {
        return this.afDatabase.object('users/' + $key);
    };
    UserService.prototype.createUser = function (user) {
        var _this = this;
        var resultSubject = new rxjs_1.ReplaySubject(1);
        if (!this.app) {
            this.app = firebase.initializeApp(firebaseConfig, 'demo');
        }
        this.app.auth().createUserWithEmailAndPassword(user.profile.email, user.password)
            .then(function (fbAuth) {
            var updatedUserData = {};
            updatedUserData["roles/" + user.role.$key + "/users/" + fbAuth.uid] = true;
            updatedUserData["users/" + fbAuth.uid] = {
                profile: {
                    email: user.profile.email,
                    name: user.profile.name,
                    surname: user.profile.surname
                },
                role: {
                    id: user.role.$key,
                    name: user.role.name
                }
            };
            _this.afDatabase.object('/').update(updatedUserData)
                .then(function () {
                resultSubject.next(user);
                console.log(user);
            })
                .catch(function (err) {
                console.log(err);
                resultSubject.error(err);
            });
        })
            .catch(function (err) {
            resultSubject.error(err);
        });
        return resultSubject;
    };
    UserService.prototype.updateUserProfile = function (user) {
        var resultSubject = new rxjs_1.ReplaySubject(1);
        if (user !== undefined &&
            user.$key !== undefined) {
            var dataToUpdate = {};
            dataToUpdate["users/" + user.$key + "/profile/name"] = user.profile.name;
            dataToUpdate["users/" + user.$key + "/profile/surname"] = user.profile.surname;
            // dataToUpdate[`users/${user.$key}/profile/email`] = user.profile.email;
            this.afDatabase.object('/')
                .update(dataToUpdate)
                .then(function () {
                resultSubject.next(user);
                resultSubject.complete();
            })
                .catch(function (err) {
                resultSubject.error(err);
                resultSubject.complete();
            });
        }
        return resultSubject;
    };
    UserService.prototype.deleteUser = function (user) {
        var resultSubject = new rxjs_1.ReplaySubject(1);
        if (user !== undefined && user.$key !== undefined) {
            var dataToDelete = {};
            dataToDelete["users/" + user.$key] = null;
            dataToDelete["roles/" + user.role.id + "/users/" + user.$key] = null;
            this.afDatabase.object('/').update(dataToDelete)
                .then(function () {
                resultSubject.next(user);
            })
                .catch(function (err) {
                resultSubject.error(err);
            });
        }
        return resultSubject;
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable()
], UserService);
exports.UserService = UserService;

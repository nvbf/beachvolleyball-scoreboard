// //flow.js
//
// import {
//   combineReducers
// } from 'redux-immutable';
//
// import { Set } from 'immutable';
//
// import {
//   createStore
// } from 'redux';
//
//
// const util = require('util');
// const EventEmitter = require('events').EventEmitter;
// const Team = require('./Team');
// const Set = require('./Set');
//
// const DefaultSetOption = Record({
//   length: 21,
//   switch: 7,
//   tto: 21,
//   timeoutLimit: 1
// })
//
// const thirdSetOption = new DefaultSetOption({
//     length: 15,
//     switch: 5,
//     tto: NaN,
//     timeoutLimit: 1
// });
//
// {
//     hometeam: new Team('', ''),
//     awayteam: new Team('', ''),
//     sets: [new Set(DefaultSetOption), new Set(DefaultSetOption), new Set(thirdSetOption)],
//     currentSet: 0,
//     currentSetScore: set1.score,
//     homeTeamTimeout: 0,
//     awayTeamTimeout: 0,
//     finished: false,
//     events: []
//   };
//
//   return this;
// }
//
// util.inherits(Match, EventEmitter);
//
//
// Match.prototype.notification = undefined;
//
// Match.prototype.getCurrentSet = function() {
//   return this.state.sets[this.state.currentSet];
// };
//
// Match.prototype.nextSet = function() {
//   this.state.currentSet++;
//   this.currentSetScore = this.getCurrentSet();
// };
//
// Match.prototype.setPrivateState = function(state) {
//   this.state = state;
// };
//
// Match.prototype.addHomeTeam = function(team) {
//   this.state.hometeam = team;
// };
//
// Match.prototype.homeTeam = function() {
//   return this.state.hometeam.players();
// };
//
// Match.prototype.addAwayTeam = function(team) {
//   this.state.awayteam = team;
// };
//
// Match.prototype.awayTeam = function() {
//   return this.state.awayteam.players();
// };
//
// Match.prototype.sets = function() {
//   return this.state.sets;
// };
//
// Match.prototype.addEvent = function(msg) {
//   this.state.events.push(msg);
// }
//
// Match.prototype.homeTeamTakesTimeout = function() {
//   this.state.homeTeamTimeout = 1;
//   this.state.events.push(
//     this.state.hometeam.display() +
//     ' takes timeout on ' +
//     this.getCurrentSet().score.join('-'));
// };
//
// Match.prototype.awayTeamTakesTimeout = function() {
//   this.state.awayTeamTimeout = 1;
//   this.state.events.push(
//     this.state.awayteam.display() +
//     ' takes timeout on ' +
//     this.getCurrentSet().score.join('-'));
// };
//
// module.exports = Match;

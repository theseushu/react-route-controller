'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.replaceReducers = replaceReducers;

var _redux = require('redux');

var _ducks = require('../ducks');

var _ducks2 = _interopRequireDefault(_ducks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RRCReducer = {};
RRCReducer[_ducks.RRC] = _ducks2.default;

function replaceReducers(store, reducers) {
  store.replaceReducer((0, _redux.combineReducers)(_extends({}, RRCReducer, reducers)));
}
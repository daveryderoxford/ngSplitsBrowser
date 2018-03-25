"use strict";
// import { OEvent } from '../../../src/app/model/oevent';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
///////////////////
var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.eventIndices = functions.database.ref('/events/{key}').onWrite(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var written, previous;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                written = event.data.val();
                previous = event.data.previous.val();
                if (!((written.club !== previous.club) ||
                    (written.eventdate !== previous.eventdate))) return [3 /*break*/, 2];
                written.club_date_index = padRight(written.club.toLowerCase(), 10) + decreasingTimeIndex(written.eventdate);
                written.date_club_index = decreasingTimeIndex(written.eventdate) + padRight(written.club.toLowerCase(), 10);
                return [4 /*yield*/, event.data.ref.set(written)];
            case 1: return [2 /*return*/, (_a.sent())];
            case 2: return [2 /*return*/];
        }
    });
}); });
exports.eventClubReferencesUpdate = functions.database.ref('/events/{key}').onUpdate(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var written, previous;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                written = event.data.val();
                previous = event.data.previous.val();
                if (!((written.club !== previous.club) ||
                    (written.nationality !== previous.nationality))) return [3 /*break*/, 3];
                return [4 /*yield*/, removeClubReference(previous)];
            case 1:
                _a.sent();
                return [4 /*yield*/, addClubReference(written)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.eventClubReferencesDelete = functions.database.ref('/events/{key}').onDelete(function (event) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, removeClubReference(event.data.previous.val())];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.eventClubReferencesCreate = functions.database.ref('/events/{key}').onCreate(function (event) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, addClubReference(event.data.val())];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function addClubReference(event) {
    return __awaiter(this, void 0, void 0, function () {
        var clubRef, clubSnapshot, club;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clubRef = getClubRef(event);
                    return [4 /*yield*/, clubRef.once('value')];
                case 1:
                    clubSnapshot = _a.sent();
                    club = clubSnapshot.val();
                    if (!club) {
                        club = {
                            name: event.club,
                            nationality: event.nationality,
                            numEvents: 0
                        };
                        console.log('Creating new club ' + club.name + '  ' + club.nationality);
                    }
                    club.numEvents = club.numEvents + 1;
                    return [4 /*yield*/, clubRef.set(club)];
                case 2:
                    _a.sent();
                    console.log('Added club reference ' + club.name + '  ' + club.nationality + ' Num events' + club.numEvents);
                    return [2 /*return*/];
            }
        });
    });
}
function removeClubReference(event) {
    return __awaiter(this, void 0, void 0, function () {
        var clubRef, clubSnapshot, club;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clubRef = getClubRef(event);
                    return [4 /*yield*/, clubRef.once('value')];
                case 1:
                    clubSnapshot = _a.sent();
                    club = clubSnapshot.val();
                    if (!club) {
                        console.log('Removing reference club not found');
                        return [2 /*return*/];
                    }
                    club.numEvents = club.numEvents - 1;
                    if (!(club.numEvents === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, clubRef.remove()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, clubRef.set(club)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    console.log('Removed club reference ' + club.name + '  ' + club.nationality + ' Num events' + club.numEvents);
                    return [2 /*return*/];
            }
        });
    });
}
function getClubRef(event) {
    var key = padRight(event.club.toLowerCase(), 10) + event.nationality;
    key = encodeAsFirebaseKey(key);
    var ref = admin.database().ref('clubs/' + key);
    return (ref);
}
function decreasingTimeIndex(dateStr) {
    var d1 = new Date('2050-01-01 00:00:00').getTime() / 1000;
    var d2 = new Date(dateStr).getTime() / 1000;
    var minusDate = d1 - d2;
    var str = padRight(minusDate.toString(), 15);
    return (str);
}
function padRight(str, length) {
    while (str.length < length) {
        str = str + '-';
    }
    return str;
}
function encodeAsFirebaseKey(string) {
    return string.replace(/\%/g, '%25')
        .replace(/\./g, '%2E')
        .replace(/\#/g, '%23')
        .replace(/\$/g, '%24')
        .replace(/\//g, '%2F')
        .replace(/\[/g, '%5B')
        .replace(/\]/g, '%5D');
}
;
//# sourceMappingURL=index.js.map
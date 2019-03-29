"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventGrades = /** @class */ (function () {
    function EventGrades() {
    }
    EventGrades.indexObject = function (grade) {
        var grades = EventGrades.grades.reverse();
        var gradeIndex = grades.indexOf(grade);
        var ret = {};
        for (var i = gradeIndex; i < grades.length; i++) {
            ret[grades[i]] = true;
        }
        return ret;
    };
    EventGrades.grades = ["IOF", "International", "National", "Regional", "Club", "Local"];
    return EventGrades;
}());
exports.EventGrades = EventGrades;
var EventDisciplines = /** @class */ (function () {
    function EventDisciplines() {
    }
    EventDisciplines.disciplines = ["Sprint", "Urban", "Middle", "Long", "Ultralong", "Other"];
    return EventDisciplines;
}());
exports.EventDisciplines = EventDisciplines;
var EventTypes = /** @class */ (function () {
    function EventTypes() {
    }
    EventTypes.types = ["Foot", "Bike", "Ski", "Trail", "Other"];
    return EventTypes;
}());
exports.EventTypes = EventTypes;
var ControlCardTypes = /** @class */ (function () {
    function ControlCardTypes() {
    }
    ControlCardTypes.types = ["SI", "Emit", "Other"];
    return ControlCardTypes;
}());
exports.ControlCardTypes = ControlCardTypes;
//# sourceMappingURL=oevent.js.map
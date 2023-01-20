Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.TestNotificationSender =
  exports.TestUrlOpener =
  exports.rangeToString =
  exports.positionToString =
    undefined;
const r = require(1547);
function positionToString(e) {
  return `${e.line}:${e.character}`;
}
exports.positionToString = positionToString;
exports.rangeToString = function (e) {
  return `[${positionToString(e.start)}--${positionToString(e.end)}]`;
};
exports.TestUrlOpener = class {
  constructor() {
    this.openedUrls = [];
  }
  open(e) {
    this.openedUrls.push(e);
  }
};
class TestNotificationSender extends r.NotificationSender {
  constructor() {
    super();
    this.sentMessages = [];
  }
  showWarningMessage(e, ...t) {
    this.sentMessages.push(e);
    return t ? Promise.resolve(t[0]) : Promise.resolve(undefined);
  }
}
exports.TestNotificationSender = TestNotificationSender;
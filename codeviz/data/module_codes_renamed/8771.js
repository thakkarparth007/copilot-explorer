Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.TestNotificationSender =
  exports.TestUrlOpener =
  exports.rangeToString =
  exports.positionToString =
    undefined;
const M_notification_sender_maybe = require("notification-sender");
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
class TestNotificationSender extends M_notification_sender_maybe.NotificationSender {
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

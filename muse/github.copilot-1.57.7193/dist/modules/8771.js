Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.TestNotificationSender = exports.TestUrlOpener = exports.rangeToString = exports.positionToString = undefined;
const r = require(1547);
function o(e) {
  return `${e.line}:${e.character}`;
}
exports.positionToString = o;
exports.rangeToString = function (e) {
  return `[${o(e.start)}--${o(e.end)}]`;
};
exports.TestUrlOpener = class {
  constructor() {
    this.openedUrls = [];
  }
  open(e) {
    this.openedUrls.push(e);
  }
};
class i extends r.NotificationSender {
  constructor() {
    super();
    this.sentMessages = [];
  }
  showWarningMessage(e, ...t) {
    this.sentMessages.push(e);
    return t ? Promise.resolve(t[0]) : Promise.resolve(undefined);
  }
}
exports.TestNotificationSender = i;
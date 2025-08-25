"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["ADD_MONEY"] = "ADD_MONEY";
    TransactionType["SEND_MONEY"] = "SEND_MONEY";
    TransactionType["WITHDRAW"] = "WITHDRAW";
    TransactionType["CASH_IN"] = "CASH_IN";
    TransactionType["CASH_OUT"] = "CASH_OUT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["REVERSE"] = "RESERSE";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));

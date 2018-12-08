/*!
 * Copyright 2018 CoNET Technology Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class keyPairSign {
    constructor(exit) {
        this.exit = exit;
        this.signError = ko.observable(false);
        this.conformButtom = ko.observable(false);
        this.requestActivEmailrunning = ko.observable(false);
        this.showSentActivEmail = ko.observable(-1);
        this.conformText = ko.observable('');
        this.conformTextError = ko.observable(false);
        this.requestError = ko.observable(-1);
        this.conformTextErrorNumber = ko.observable(-1);
        this.activeing = ko.observable(false);
        const self = this;
        this.conformText.subscribe(function (newValue) {
            if (!newValue || !newValue.length) {
                self.conformButtom(false);
            }
            else {
                self.conformButtom(true);
            }
        });
    }
    checkActiveEmailSubmit() {
        const self = this;
        this.conformTextError(false);
        this.activeing(true);
        let text = this.conformText();
        if (/ /.test(text)) {
            text = text.replace(/ PGP MESSAGE/g, '__PGP__MESSAGE').replace(/ /g, '\r\n').replace(/__/g, ' ');
            text = text.replace(/ MESSAGE-----/, ' MESSAGE-----\r\n');
        }
    }
    requestActivEmail() {
        const self = this;
        this.requestActivEmailrunning(true);
    }
}
class CoNETConnect {
    constructor(email, isKeypairBeSign, confirmRisk, account, ready) {
        this.email = email;
        this.isKeypairBeSign = isKeypairBeSign;
        this.account = account;
        this.ready = ready;
        this.showSendImapDataWarning = ko.observable(false);
        this.showConnectCoNETProcess = ko.observable(true);
        this.connectStage = ko.observable(0);
        this.connetcError = ko.observable(-1);
        this.connectedCoNET = ko.observable(false);
        this.keyPairSign = ko.observable(null);
        const self = this;
        if (!confirmRisk) {
            this.showSendImapDataWarning(true);
        }
        else {
            this.imapConform();
        }
    }
    listingConnectStage(err, stage, showCoGate) {
        const self = this;
        this.showConnectCoNETProcess(true);
        let processBarCount = 0;
        if (typeof err === 'number' && err > -1) {
            this.connectStage(-1);
            this.ready(err, false);
            return this.connetcError(err);
        }
        if (stage === 4) {
            this.showConnectCoNETProcess(false);
            this.connectedCoNET(true);
            processBarCount = 67;
            if (!this.isKeypairBeSign) {
                if (!this.keyPairSign()) {
                    let u = null;
                    return this.keyPairSign(u = new keyPairSign((function () {
                        self.keyPairSign(u = null);
                        self.ready(null, showCoGate);
                    })));
                }
                return;
            }
            return this.ready(null, showCoGate);
        }
        $('.keyPairProcessBar').progress({
            percent: processBarCount += 33
        });
        if (this.connectStage() === 3) {
            return;
        }
        return this.connectStage(stage);
    }
    returnToImapSetup() {
        return this.ready(0, true);
    }
    imapConform() {
        const self = this;
        let sendconnectMail = false;
        this.showSendImapDataWarning(false);
        this.connetcError(-1);
        this.showConnectCoNETProcess(true);
        //return socketIo.emit11 ( 'tryConnectCoNET' )
    }
}
class imapForm extends storageClass {
    constructor(account, imapData, exit) {
        super();
        this.account = account;
        this.exit = exit;
        this.emailAddress = ko.observable('');
        this.password = ko.observable('');
        this.emailAddressShowError = ko.observable(false);
        this.passwordShowError = ko.observable(false);
        this.EmailAddressErrorType = ko.observable(0);
        this.showForm = ko.observable(true);
        this.checkProcessing = ko.observable(false);
        this.checkImapError = ko.observable(-1);
        this.showCheckProcess = ko.observable(false);
        this.checkImapStep = ko.observable(0);
        const self = this;
        if (imapData) {
            this.emailAddress(imapData.imapUserName);
            this.password(imapData.imapUserPassword);
        }
        this.emailAddress.subscribe(function (newValue) {
            return self.checkEmailAddress(newValue);
        });
        this.password.subscribe(function (newValue) {
            return self.clearError();
        });
    }
    clearError() {
        this.emailAddressShowError(false);
        this.EmailAddressErrorType(0);
        this.passwordShowError(false);
    }
    checkImapSetup() {
        const processBar = $('.keyPairProcessBar');
        processBar.progress('reset');
        let self = this;
        this.checkProcessing(true);
        this.checkImapStep(0);
        const imapTest = function (err) {
            if (err !== null && err > -1) {
                return errorProcess(err);
            }
            self.checkImapStep(5);
            $('.keyPairProcessBar').progress({
                percent: 33
            });
        };
        const smtpTest = function (err) {
            if (err !== null && err > -1) {
                return errorProcess(err);
            }
            self.checkImapStep(2);
            $('.keyPairProcessBar').progress({
                percent: 66
            });
        };
        const imapTestFinish = function (IinputData) {
            removeAllListen();
            return self.exit(IinputData);
        };
        const removeAllListen = function () {
        };
        const errorProcess = function (err) {
            removeAllListen();
            return self.checkImapError(err);
        };
        const postMessage = {
            command: 'checkImap',
            data: {
                email: this.emailAddress,
                passwd: this.password
            },
            direction: 'CoNET',
            serial: uuid_generate()
        };
        this.postMessage(postMessage, (msg) => {
            return this.exit(msg.data);
        });
    }
    checkEmailAddress(email) {
        this.clearError();
        if (checkEmail(email).length) {
            this.EmailAddressErrorType(0);
            this.emailAddressShowError(true);
            return initPopupArea();
        }
    }
    imapAccountGoCheckClick() {
        const self = this;
        this.checkEmailAddress(this.emailAddress());
        if (this.emailAddressShowError() || !this.password().length) {
            return;
        }
        this.showForm(false);
        this.showCheckProcess(true);
        this.checkImapError(-1);
        return this.checkImapSetup();
    }
    returnImapSetup() {
        this.showForm(true);
        this.showCheckProcess(false);
        this.checkImapError(-1);
    }
}

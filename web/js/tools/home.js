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
class view extends languageSelect {
    constructor() {
        super();
        this.sectionWelcome = ko.observable(true);
        this.showAgreement = ko.observable(false);
        this.showIconBar = ko.observable(false);
        this.showKeyPair = ko.observable(false);
        this.userAccount = ko.observable(null);
        this.imapSetup = ko.observable(null);
        this.KeyPairFormClass = ko.observable(null);
    }
    sectionAgreement(agree) {
        this.showAgreement(false);
        if (!agree) {
            return this.sectionWelcome(true);
        }
        this.agreement();
        return this.sectionKeypairForm();
    }
    afterGenerateKey() {
        return this.getConnetImap(imap => {
            if (!imap) {
                // this.imapSetup ( new imapForm ())
            }
        });
    }
    sectionKeypairForm() {
        return this.getKeypair(_keypair => {
            if (!_keypair) {
                return this.KeyPairFormClass(new keyPairGenerateForm(exit => {
                    this.KeyPairFormClass(null);
                    return this.afterGenerateKey();
                }));
            }
            return this.afterGenerateKey();
        });
    }
    showKeyInfoClick() {
        this.showKeyPair(true);
    }
    openClick() {
        this.sectionWelcome(false);
        this.isFirstRun(first => {
            if (!first) {
                return this.showAgreement(true);
            }
            return this.sectionKeypairForm();
        });
    }
}
const _view = new view();
ko.applyBindings(_view, document.getElementById('body'));

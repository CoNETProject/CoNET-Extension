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
class storageClass extends uiClass {
    constructor() {
        super();
        this._connectTab = this.BrowserObject ? this.BrowserObject.runtime.connect() : null;
        this.postMessagePool = new Map();
        if (this._connectTab && this._connectTab.onMessage && typeof this._connectTab.onMessage.addListener === 'function') {
            const _CallBack = msg => {
                if (msg && msg.direction === 'CoNET') {
                    //      callback from command
                    if (msg.serial) {
                        const CallBack = this.postMessagePool.get(msg.serial);
                        if (typeof CallBack === 'function') {
                            return CallBack(msg);
                        }
                    }
                    return this.systemMsg(msg);
                }
            };
            this._connectTab.onMessage.addListener(_CallBack);
        }
    }
    postMessage(message, CallBack) {
        if (!this._connectTab) {
            return this.platformNotSupport();
        }
        this.postMessagePool.set(message.serial, CallBack);
        return this._connectTab.postMessage(message);
    }
    storgaeSave(item) {
        if (!this.BrowserObject) {
            return this.platformNotSupport();
        }
        if (item) {
            this.BrowserObject.storage.local.set(item, () => {
                if (this.BrowserObject.storage.sync && typeof this.BrowserObject.storage.sync.set === 'function') {
                    this.BrowserObject.storage.sync.set(item, m => {
                    });
                }
            });
        }
    }
    isFirstRun(CallBack) {
        return this.storgaeRead('first', CallBack);
    }
    getKeypair(CallBack) {
        const msg = {
            serial: uuid_generate(),
            command: 'getKeypair',
            direction: 'CoNET',
            data: null
        };
        return this.postMessage(msg, (_msg) => {
            return CallBack(_msg.data);
        });
    }
    agreement() {
        this.storgaeSave({ first: true });
    }
    storgaeRead(itemName, CallBack) {
        if (!this.BrowserObject) {
            this.platformNotSupport();
            return CallBack();
        }
        const getCallBack = item => {
            return CallBack(item[itemName]);
        };
        if (itemName && typeof itemName === "string") {
            /*
            if ( this.BrowserObject.storage.sync && typeof this.BrowserObject.storage.sync.get ==='function' ) {
                return this.BrowserObject.storage.sync.get ( itemName, getCallBack )
            }
            */
            this.BrowserObject.storage.local.get(itemName, getCallBack);
        }
    }
    systemMsg(msg) {
    }
    getConnetImap(CallBack) {
        return this.storgaeRead('connectImap', CallBack);
    }
}

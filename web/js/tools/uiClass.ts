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

 class uiClass {
    public systemErrorMessage = ko.observable ('')
    public BrowserObject = null
    public systemError ( err: Error ) {
        this.systemErrorMessage( err && err.message ? err.message : '' )
        return $('.ui.basic.modal.system_error').modal ('show')
    }
    public platformNotSupport () {
        this.systemError (new Error ('CoNET donot support your platform'))
    }
    constructor () {
        if ( typeof browser === 'undefined' ) {
            if ( typeof chrome === 'object' && typeof chrome.constructor ==='function' ) {
                this.BrowserObject = chrome
                return 
            }
            this.platformNotSupport ()
        } else {
            this.BrowserObject = browser
        }
    }
}
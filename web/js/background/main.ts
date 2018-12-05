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

 

class systemClass {
    private keypairClass = null
    public accountClass: accountClass = null
    private getStorageKeyValue ( keyItem, CallBack ) {
        if ( !BrowserObject ) {
            return null
        }
        const getCallBack = item => {
            return CallBack ( item [ keyItem ] )
        }
        if ( keyItem && typeof keyItem === "string" ) {
            
            if ( BrowserObject.storage.sync && typeof BrowserObject.storage.sync.get ==='function' ) {
                return BrowserObject.storage.sync.get ( keyItem, getCallBack )
            }
            
            BrowserObject.storage.local.get ( keyItem, getCallBack )
        }

    }

    private saveStorageKeyValue ( item ) {
        if ( !BrowserObject ) {
            return null
        }
        BrowserObject.storage.local.set ( item, () => {
            
            if ( BrowserObject.storage.sync && typeof BrowserObject.storage.sync.set ==='function' ) {
                BrowserObject.storage.sync.set ( item, () => {})
            }
            
        })
    }

    public getKeyPair () {
        
        this.getStorageKeyValue ( 'keypair', ( keypair ) => {
            if ( !keypair ) {
                return
            }
            this.accountClass = new accountClass ( keypair, null )
        })
    }


    public keyPair

    constructor () {
        this.getKeyPair ()
    }
}

const BrowserObject = typeof browser === 'undefined' ? ( typeof chrome === 'object' && typeof chrome.constructor ==='function' ) ? chrome : null : browser

const keyPairGenerate = ( m: CoNET_Browser_message, CallBack ) => {
    const data: INewKeyPair = m.data
    const userId = {
		name: data.nikeName,
		email: data.email
    }
    const options = {
        userIds: [{ name: data.nikeName, email: data.email }],
        curve: "ed25519",
        passphrase: data.password,
        aead_protect: true,
		aead_protect_version: 4
    }
    return openpgp.generateKey (options).then (( keypair: { publicKeyArmored: string, privateKeyArmored: string }) => {
        const ret: keyPair = {
			publicKey: keypair.publicKeyArmored,
			privateKey: keypair.privateKeyArmored
        }
        return CallBack (ret)
        
    })
}

const TabPostMessage = ( m: CoNET_Browser_message ) => {
    if ( BrowserObject && BrowserObject.connectedTab && typeof BrowserObject.connectedTab.postMessage === 'function') {
        return BrowserObject.connectedTab.postMessage ( m )
    }
}

if ( BrowserObject ) {
    const _systemClass = new systemClass ()
    const commandListen = ( m: CoNET_Browser_message ) => {
        if ( m.direction !== 'CoNET' || ! m.command ) {
            return
        }
        switch ( m.command ) {
            case 'keyPairGenerate' : {
                const data: INewKeyPair = m.data
                return keyPairGenerate ( m, ( key: keyPair ) => {
                    _systemClass.accountClass = new accountClass ( key, data.password )
                    return _systemClass.accountClass.getAccount ( accountData => {
                        m.data = accountData
                        return TabPostMessage ( m )
                    })
                    
                })
            }
            case 'getKeypair' : {
                if ( _systemClass.accountClass ) {
                    m.data = _systemClass.accountClass.getAccount
                }
                
                return TabPostMessage ( m )
            }
            default: {
                return console.log (`unknow command! ${ m }`)
            }
        }
    }

    const serviceListenning = p => {
        BrowserObject.connectedTab = p
        p.onMessage.addListener ( commandListen )
    }

    const openMyPage = () => {
        const tab = BrowserObject.conetTab
        const removeListener = ( tabId, removeInfo ) => {
            if ( !BrowserObject.conetTab || BrowserObject.conetTab.id !== tabId ) {
                return
            }
            BrowserObject.conetTab = null
            if ( BrowserObject.connectedTab && typeof BrowserObject.connectedTab.onMessage ==='function' ) {
                BrowserObject.connectedTab.onMessage.removeListener ( commandListen )
            }
            
            BrowserObject.tabs.onRemoved.removeListener ( removeListener )
            BrowserObject.runtime.onConnect.removeListener ( serviceListenning )
        }

        if ( !tab || !tab.windowId ) {
            
            let tabObj = BrowserObject.tabs.create({
                "url": "/web/main.html"
            }, _tab => {
                BrowserObject.conetTab = _tab
            })
            BrowserObject.runtime.onConnect.addListener ( serviceListenning )
            return BrowserObject.tabs.onRemoved.addListener ( removeListener )
        }
        
        BrowserObject.tabs.update( tab.id, {
            active: true
        }, _tab => {
            let uu = _tab
        })
        
    }
    
    BrowserObject.browserAction.onClicked.addListener( openMyPage )

}




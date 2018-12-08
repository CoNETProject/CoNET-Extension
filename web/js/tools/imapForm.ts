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
	public signError = ko.observable ( false )
	public conformButtom = ko.observable ( false )
	public requestActivEmailrunning = ko.observable ( false )
	public showSentActivEmail = ko.observable ( -1 )
	public conformText = ko.observable ('')
	public conformTextError = ko.observable ( false )
	public requestError = ko.observable (-1)
	public conformTextErrorNumber = ko.observable ( -1 )
	public activeing = ko.observable ( false )
	
	constructor ( private exit: () => void ) {
		const self = this
		this.conformText.subscribe ( function ( newValue ) {
			if ( !newValue || !newValue.length ) {
				self.conformButtom ( false )
			} else {
				self.conformButtom ( true )
			}
		})
	}

	public checkActiveEmailSubmit () {
		const self = this
		this.conformTextError ( false )
		this.activeing ( true )
		
		let text = this.conformText()
		if ( / /.test ( text )) {
			text = text.replace (/ PGP MESSAGE/g, '__PGP__MESSAGE').replace (/ /g, '\r\n').replace (/__/g, ' ')
			text = text.replace (/ MESSAGE-----/,' MESSAGE-----\r\n')
		}
		
	}

	public requestActivEmail () {
		const self = this
		this.requestActivEmailrunning ( true )
		
		
	}
}

class CoNETConnect {
	public showSendImapDataWarning = ko.observable ( false )
	public showConnectCoNETProcess = ko.observable ( true )
	public connectStage = ko.observable ( 0 )
	public connetcError = ko.observable ( -1 )
	public connectedCoNET = ko.observable ( false )
	public keyPairSign: KnockoutObservable< keyPairSign > = ko.observable ( null )
	constructor ( public email: string, private isKeypairBeSign: boolean, confirmRisk: boolean, public account: string, private ready: ( err, showCoGate? ) => void ) {
		const self = this
		if ( !confirmRisk ) {
			this.showSendImapDataWarning ( true )
		} else {
			this.imapConform ()
		}

	}

	public listingConnectStage ( err, stage, showCoGate: boolean ) {
		const self = this
		this.showConnectCoNETProcess ( true )
		let processBarCount = 0
		if ( typeof err === 'number' && err > -1 ) {
			this.connectStage ( -1 )
			this.ready ( err, false )
			return this.connetcError ( err )
		}
		
		if ( stage === 4 ) {
			this.showConnectCoNETProcess ( false )
			this.connectedCoNET ( true )
			processBarCount = 67
			if ( !this.isKeypairBeSign ) {
				if ( !this.keyPairSign()) {
					let u = null
					return this.keyPairSign ( u = new keyPairSign (( function () {
						
						self.keyPairSign ( u = null )
						self.ready ( null, showCoGate )
					})))
				}
				return
			}

			return this.ready ( null, showCoGate )
		}
		
		$('.keyPairProcessBar').progress ({
			percent: processBarCount += 33
		})
		if ( this.connectStage() === 3 ) {
			return
		}
		return this.connectStage ( stage )
		
	}

	public returnToImapSetup () {
		return this.ready ( 0, true )
	}

	public imapConform () {
		const self = this
		
		let sendconnectMail = false
		this.showSendImapDataWarning ( false )
		this.connetcError ( -1 )
		this.showConnectCoNETProcess ( true )
		//return socketIo.emit11 ( 'tryConnectCoNET' )
	}
}



class imapForm extends storageClass {
	public emailAddress = ko.observable ('')
	public password = ko.observable ('')
	public emailAddressShowError = ko.observable ( false )
	public passwordShowError = ko.observable ( false )
	public EmailAddressErrorType = ko.observable ( 0 )
	public showForm = ko.observable ( true )
	public checkProcessing = ko.observable ( false )
	public checkImapError = ko.observable (-1)
	public showCheckProcess = ko.observable ( false )
	public checkImapStep = ko.observable (0)
	
	
	private clearError () {
		this.emailAddressShowError ( false )
		this.EmailAddressErrorType (0)
		this.passwordShowError ( false )
	}
	
	private checkImapSetup () {
		const processBar = $('.keyPairProcessBar')
		processBar.progress ('reset')
		let self = this
		this.checkProcessing ( true )
		this.checkImapStep (0)
		
		const imapTest = function ( err ) {
			if ( err !== null && err > -1 ) {
				return errorProcess ( err )
			}
			self.checkImapStep (5)
			$('.keyPairProcessBar').progress ({
				percent: 33
			})
		}

		const smtpTest = function ( err ) {
			
			if ( err !== null && err > -1 ) {
				return errorProcess ( err )
			}
			self.checkImapStep (2)
			$('.keyPairProcessBar').progress ({
				percent: 66
			})
		}

		const imapTestFinish = function ( IinputData: IinputData ) {
			removeAllListen ()
			return self.exit ( IinputData )
		}

		const removeAllListen = function () {
		}

		const errorProcess = function ( err ) {
			removeAllListen ()
			return self.checkImapError ( err )
		}
		const postMessage: CoNET_Browser_message = {
			command: 'checkImap',
			data: {
				email: this.emailAddress,
				passwd: this.password
			},
			direction: 'CoNET',
			serial: uuid_generate ()

		}
		
		this.postMessage ( postMessage, ( msg: CoNET_Browser_message ) => {
			return this.exit ( msg.data )
		})


	}

	private checkEmailAddress ( email: string ) {
		this.clearError ()
		if ( checkEmail ( email ).length ) {
			this.EmailAddressErrorType (0)
			this.emailAddressShowError ( true )
			return initPopupArea ()
		}
		
	}

	constructor ( private account: string, imapData: IinputData, private exit: ( IinputData: IinputData ) => void ) {
		super()
		const self = this
		if ( imapData ) {
			this.emailAddress ( imapData.imapUserName )
			this.password ( imapData.imapUserPassword )
		}

		this.emailAddress.subscribe ( function ( newValue ) {
			return self.checkEmailAddress ( newValue )
		})

		this.password.subscribe ( function ( newValue ) {
			return self.clearError ()
		})
	}

	public imapAccountGoCheckClick () {
		const self = this
		this.checkEmailAddress ( this.emailAddress() )
		
		if ( this.emailAddressShowError() || !this.password().length ) {
			return
		}
		this.showForm ( false )
		this.showCheckProcess ( true )
		this.checkImapError ( -1 )
		
		return this.checkImapSetup ()
		
	}

	public returnImapSetup () {
		this.showForm ( true )
		this.showCheckProcess ( false )
		this.checkImapError ( -1 )
	}
}
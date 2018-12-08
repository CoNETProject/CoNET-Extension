class CoNET_IMAP {
    private connect () {
        if ( ! this.IMapConnect.imapSsl ) {

        } else {
            
        }
    }
    constructor ( public IMapConnect: imapConnect, public listenFolder: string, public deleteBoxWhenEnd: boolean, public writeFolder: string, private debug: boolean, public newMail: ( mail ) => void ) {

    }
}
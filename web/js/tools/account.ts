const QTGateSignKeyID = /3acbe3cbd3c1caa9/i

const getEmailAddressFromKeypairUserObj = ( str: string ) => {
    const uu = str.split ('<')
    return uu[1].substr( 0, uu[1].length -1 )
}
const getNicknameFromKeypairUserObj = ( str: string ) => {
    const uu = str.split ('<')
    return uu[0]
}
const checkCoNETign = ( user ) => {
    if ( !user.otherCertifications || !user.otherCertifications.length ) {
        return null
    }
    let Certification = false
    user.otherCertifications.forEach ( n => {
        if ( QTGateSignKeyID.test ( n.issuerKeyId.toHex ().toLowerCase())) {
            return Certification = true
        }
    })
    return Certification
}
    
    
class accountClass {
    private privKeyObj = null
    private pubKeyObj = null
    private username = null
    private nickName = null
    private createDate = null
    private publicKeyID = null
    private isSignByCoNET = false
    private passwordOK = false
    private dataReady = false
    private async getKeypairInfo () {
        if ( this.keypair && this.keypair.privateKey && this.keypair.publicKey ) {
            this.privKeyObj = await openpgp.key.readArmored( this.keypair.privateKey )
            this.pubKeyObj = await openpgp.key.readArmored( this.keypair.publicKey )
            this.passwordOK = await this.privKeyObj.keys[0].decrypt( this.passphrase )
            const userObj = this.pubKeyObj.keys[0].users[0].userId
            this.username = userObj.email
            this.nickName = userObj.name
            this.createDate = this.privKeyObj.keys[0].primaryKey.created
            this.isSignByCoNET = checkCoNETign ( this.pubKeyObj.keys[0].users[0] )
            this.publicKeyID = this.pubKeyObj.keys[0].primaryKey.getFingerprint().toUpperCase()
            this.dataReady = true
        }
    }
    constructor ( private keypair: keyPair, private passphrase: string ) {
        this.getKeypairInfo ()
    }
    public getAccount ( CallBack ) {

        if ( !this.dataReady ) {
            return setTimeout (() => {
                this.getAccount ( CallBack )
            }, 1000)
        }
        const keyPair = {
            publicKey: this.keypair.publicKey,
            privateKey: this.keypair.privateKey,
            keyLength: null,
            nikeName: this.nickName,
            createDate: this.createDate,
            email: this.username,
            passwordOK: this.passwordOK,
            verified: this.isSignByCoNET,
            publicKeyID: this.publicKeyID
        }
        return CallBack ( keyPair )
    }
 }
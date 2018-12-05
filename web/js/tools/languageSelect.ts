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

 enum lang { 'zh', 'ja', 'en', 'tw' }

class languageSelect extends storageClass {
    private storage_name = 'languageSelect'
    private ui = new uiClass ()
    
    public menu = {
        'zh':[{
            LanguageJsonName: 'zh',
            showName: '简体中文',
            icon: 'flag-icon-cn'
        },
        {
            LanguageJsonName: 'en',
            showName: '英文/English',
            icon: 'flag-icon-gb'
        },
        {
            LanguageJsonName: 'ja',
            showName: '日文/日本語',
            icon: 'flag-icon-jp'
        },{
            LanguageJsonName: 'tw',
            showName: '繁体字中文/正體字中文',
            icon: 'flag-icon-tw'
        }],
        'ja': [{
            LanguageJsonName: 'ja',
            showName: '日本語',
            icon: 'flag-icon-jp'
        },
        {
            LanguageJsonName: 'en',
            showName: '英語/English',
            icon: 'flag-icon-gb'
        },
        {
            LanguageJsonName: 'zh',
            showName: '簡体字中国語/简体中文',
            icon: 'flag-icon-cn'
        },{
            LanguageJsonName: 'tw',
            showName: '繁体字中国語/正體字中文',
            icon: 'flag-icon-tw'
        }],
        'en': [{
            LanguageJsonName: 'en',
            showName: 'English',
            icon: 'flag-icon-gb'
        },
        {
            LanguageJsonName: 'ja',
            showName: 'Japanese/日本語',
            icon: 'flag-icon-jp'
        },
        {
            LanguageJsonName: 'zh',
            showName: 'Simplified Chinese/简体中文',
            icon: 'flag-icon-cn'
        },
        {
            LanguageJsonName: 'tw',
            showName: 'Traditional Chinese/正體字中文',
            icon: 'flag-icon-tw'
        }],
        'tw':[
        {
            LanguageJsonName: 'tw',
            showName: '正體字中文',
            icon: 'flag-icon-tw'
        },{
            LanguageJsonName: 'en',
            showName: '英文/English',
            icon: 'flag-icon-gb'
        },
        {
            LanguageJsonName: 'ja',
            showName: '日文/日本語',
            icon: 'flag-icon-jp'
        },
        {
            LanguageJsonName: 'zh',
            showName: '簡體字中文/简体中文',
            icon: 'flag-icon-cn'
        }]
    }
    public LocalLanguage = 'up'
    public tLang: KnockoutObservable < string > = ko.observable ()
    public languageIndex: KnockoutObservable < number > = ko.observable (2)
    public selectItem ( plus: number ) {
        
        const tindex = lang [ this.tLang ()]
        let index =  tindex + ( typeof plus === 'number' ? 0 : 1 )
        if ( index > 3 ) {
            index = 0
        }
        this.tLang ( lang [index] )
        this.storgaeSave ({ languageSelect: lang [index] })
        this.changeLanguage ()

        const obj = $( "span[ve-data-bind]" )
        
        obj.each ( function ( index, element ) {
            
            const ele = $( element )
            const data = ele.attr ( 've-data-bind' )
            if ( data && data.length ) {
                ele.text ( eval ( data ))
            }
        })
        
        $('.languageText').shape (`flip ${ this.LocalLanguage }`)
        $('.KnockoutAnimation').transition('jiggle')
        
        return initPopupArea()
    }

    private changeLanguage () {
        
        this.languageIndex ( lang [ this.tLang() ])
    }
    constructor () {
        super ()
        let language = window.navigator.language || 'en'
        language = language.substr (0,2)
        this.tLang ( language )
        this.storgaeRead ( this.storage_name,  item => {
            
            if ( typeof item === 'string' && item.length ) {
                this.tLang ( item )
            }
            const tindex = lang [ this.tLang ()]
            const inedx =  ( tindex - 1 < 0 ) ? 3 : tindex - 1
            const _lang = lang [ inedx ]
            $(`.languageItem.${ _lang }`).addClass ('active')
            $(`.languageText`).shape ()

            this.selectItem ( 0 )
        })
        
    }
}
"use strict" ;
const vscode = require('vscode');

// Gesion de l'ouput Manager
// const outputMngr = require('./outputMngr.js')
// - outputMngr.setContext(context) ;
// - outputMngr.clear() ; // Pour effacer
// - outputMngr.affich('message à afficher') ;
// - outputMngr.show() : Affichage de la sortie output

// Dans activate de l'extension :
//    const outputMngr = require('./outputMngr.js') ;
//    outputMngr.setContext(context) ;

const outputMngr = {

    libelleOutput: 'Macro Node.js'
    ,
    outputC: ''
    ,
    context: ''
}

// Alimentation du context pour récupérer les informations de l'extension
const setContext = function(context) {
    outputMngr.context = context ;
}

// Effacement de la sortie Output
const clear = function(show = false) {
    if(outputMngr.outputC == '') {
        outputMngr.outputC = vscode.window.createOutputChannel(outputMngr.libelleOutput) ;
    }
    outputMngr.outputC.clear() ;
    if (outputMngr.context != '') {
        outputMngr.outputC.appendLine(getTime() + ' - ' + outputMngr.context?.extension?.packageJSON?.name + ' - v' + outputMngr.context?.extension?.packageJSON?.version ) ;
    }
    if (show) {
        outputMngr.outputC.show() ;
    }
}

// Affichage du message
const affich = function(message) {
    if (outputMngr.outputC == '') {
        clear() ;
    }
    if(typeof(message) == 'object') {
        outputMngr.outputC.appendLine(getTime() + ' - ' + JSON.stringify(message,undefined,3)) ;
    } else {
        outputMngr.outputC.appendLine(getTime() + ' - ' + message) ;
    }
}

const getTime = function() {
    let dt = new Date() ;
    return (''+dt.getHours()).padStart(2,'0') + ':' + (''+dt.getMinutes()).padStart(2,'0') + ':' + (''+dt.getSeconds()).padStart(2,'0') + '.' + (''+dt.getUTCMilliseconds()).padStart(3,'0') ;
}

const show = function() {
    outputMngr.outputC.show() ;
}

module.exports = {
	affich, clear, setContext, show
}
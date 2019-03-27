import { Template } from 'meteor/templating';

import Quagga from './quagga.js';

import '../templates/detection.html'
import '../templates/vente.html'
import '../templates/search.html'

function trierParOccurence(arr) {
    var counts = {};
    arr.forEach(function(value){
        if(value.length >= 10){
            if(!counts[value]) {
                counts[value] = 0;
            }
            counts[value]++;
        }
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
}

function load_quagga(){
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
    console.log("works here")
    let last_result = [];
    if (Quagga.initialized == undefined) {
        Quagga.onDetected(function(result) {
            let last_code = result.codeResult.code;
            if(last_code.length == 10 || last_code.length == 13){
                last_result.push(last_code);
                console.log(last_code)
            }
            if (last_result.length > 20) {
                code = trierParOccurence(last_result);
                console.log(last_result)
                last_result = []
                Quagga.stop();
                alert(code);
                FlowRouter.go("venteInfos",{ isbn: code });
                //location.reload()
            }
        });
    }
    Quagga.init({
        inputStream : {
            name : "Live",
            type : "LiveStream",
            numOfWorkers: navigator.hardwareConcurrency,
            target: document.querySelector('#barcode-scanner')  
        },
        decoder: {
            readers : ['ean_reader','ean_8_reader','code_39_reader','code_39_vin_reader','codabar_reader','upc_reader','upc_e_reader']
        }
    },
    function(err) {
        if (err) { console.log(err); return }
        Quagga.initialized = true;
        Quagga.start();
    });
    }
};

Template.detection.events({
    'click #click': function(e){
        e.preventDefault();
        load_quagga();
    }
})
import { Template } from 'meteor/templating';

import Quagga from './quagga.js';

import '../templates/detection.html'
import '../templates/vente.html'

function order_by_occurrence(arr) {
    var counts = {};
    arr.forEach(function(value){
        if(!counts[value]) {
            counts[value] = 0;
        }
        counts[value]++;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
}
  
function load_quagga(){
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
    console.log("works here")
    var last_result = [];
    if (Quagga.initialized == undefined) {
        Quagga.onDetected(function(result) {
            var last_code = result.codeResult.code;
            last_result.push(last_code);
            if (last_result.length > 20) {
                code = order_by_occurrence(last_result);
                last_result = []
                Quagga.stop();
                if(code == "9781853260919"){
                    alert("Réussi !")
                }else{
                    alert(code)
                }
                location.reload()
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
    },function(err) {
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
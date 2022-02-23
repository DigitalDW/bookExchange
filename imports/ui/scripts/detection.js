import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import Quagga from './quagga.js';
import Swal from 'sweetalert2';

import '../templates/detection.html';
import '../templates/vente.html';

function trierParOccurence(arr) {
  var counts = {};
  arr.forEach(function (value) {
    if (value.length >= 10) {
      if (!counts[value]) {
        counts[value] = 0;
      }
      counts[value]++;
    }
  });
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
}

function load_quagga() {
  // document.getElementById("progBar").style.width = `0%`
  // let instance = Template.instance().feedVideo
  // console.log(instance)
  if (
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  ) {
    Swal.fire({
      html:
        '<h2 style="color:#e9ecef">Succès !</h2>' +
        '<p style="color:#e9ecef">Une caméra a été trouvée.</p>',
      type: 'success',
      confirmButtonText: 'Continuer',
      background: '#3A3F44',
      confirmButtonColor: 'rgb(156, 164, 170)',
      onClose: () => {
        let len = 0;
        let last_result = [];
        if (Quagga.initialized == undefined) {
          Quagga.onDetected(function (result) {
            let last_code = result.codeResult.code;
            if (last_code.length == 10 || last_code.length == 13) {
              last_result.push(last_code);
              len += 5;
              console.log(len);
              document.getElementById('progBar').style.width = `${len}%`;
              console.log(last_code);
            }
            if (last_result.length > 19) {
              code = trierParOccurence(last_result);
              console.log(code);
              last_result = [];
              len = 0;
              Quagga.stop();

              let video = document.querySelector('#barcode-scanner video');
              let canvas = document.querySelector('#barcode-scanner canvas');
              let br = document.querySelector('br');
              let div = document.getElementById('barcode-scanner');
              let progressDiv = document.getElementById('progressBar');
              let progess = document.getElementById('prog2');
              let progess2 = document.getElementById('progBar');

              div.removeChild(video);
              div.removeChild(canvas);
              div.removeChild(br);
              progess.removeChild(progess2);
              progressDiv.removeChild(progess);

              Swal.fire({
                type: 'info',
                background: '#3A3F44',
                showConfirmButton: false,
                html: `<p style="color:#e9ecef">
                                        Nous interrogeons des bases de données, veuillez patienter.
                                    </p>
                                    <div class="loader"></div>`,
                onOpen: () => {
                  $.getJSON(
                    `https://www.googleapis.com/books/v1/volumes?q=isbn:${code}`
                  ).then((res) => {
                    if (typeof res.items !== 'undefined') {
                      Swal.fire({
                        type: 'success',
                        background: '#3A3F44',
                        confirmButtonColor: 'rgb(156, 164, 170)',
                        cancelButtonColor: 'rgb(92, 98, 102)',
                        html: `<h2 style="color:#e9ecef">Succès</h2>
                                                        <p style="color:#e9ecef">
                                                            Nous avons trouvé: ${res.items[0].volumeInfo.title}. <br/>
                                                            Est-ce votre livre ? Si non, nous irons chercher ailleurs...
                                                        </p>`,
                        confirmButtonText: 'Oui !',
                        showCancelButton: true,
                        cancelButtonText: 'Non !',
                        preConfirm: () => {
                          Session.set('method', 'gb');
                          FlowRouter.go(`/vente/${code}`);
                        },
                      }).then((res) => {
                        if (res.dismiss === Swal.DismissReason.cancel) {
                          Swal.fire({
                            type: 'info',
                            background: '#3A3F44',
                            showConfirmButton: false,
                            html: `<p style="color:#e9ecef">
                                                                    Nous interrogeons des bases de données, veuillez patienter.
                                                                </p>
                                                                <div class="loader"></div>`,
                          });
                          searchGoodreads();
                        }
                      });
                    } else {
                      searchGoodreads();
                    }
                  });
                },
              });
            }
          });
        }
        Quagga.init(
          {
            inputStream: {
              name: 'Live',
              type: 'LiveStream',
              numOfWorkers: navigator.hardwareConcurrency,
              target: document.querySelector('#barcode-scanner'),
              locator: {
                halfSample: true,
                patchSize: 'medium', // x-small, small, medium, large, x-large
                debug: {
                  showCanvas: false,
                  showPatches: false,
                  showFoundPatches: false,
                  showSkeleton: false,
                  showLabels: false,
                  showPatchLabels: false,
                  showRemainingPatchLabels: false,
                  boxFromPatches: {
                    showTransformed: false,
                    showTransformedBox: false,
                    showBB: false,
                  },
                },
              },
            },
            area: {
              top: '33%',
              right: '25%',
              left: '25%',
              bottom: '33%',
            },
            decoder: {
              readers: ['ean_reader', 'ean_8_reader'],
              debug: {
                drawBoundingBox: true,
                showPattern: true,
              },
            },
          },
          function (err) {
            if (err) {
              console.log(err);
              return;
            }
            Quagga.initialized = true;
            Quagga.start();
          }
        );
      },
    });
  }
}

Template.detection.onCreated(function () {
  this.feedVideo = new ReactiveVar(false);
});

Template.detection.helpers({
  joueVideo: () => {
    if (Session.get('newTry')) {
      Template.instance().feedVideo.set(false);
      Session.set('newTry', false);
      return Template.instance().feedVideo.get();
    } else {
      return Template.instance().feedVideo.get();
    }
  },
});

Template.detection.events({
  'click #scanISBN': function (e, template) {
    e.preventDefault();

    if (template.feedVideo.get()) {
      template.feedVideo.set(false);
      Quagga.stop();
      let video = document.querySelector('#barcode-scanner video');
      let canvas = document.querySelector('#barcode-scanner canvas');
      let br = document.querySelector('br');
      let div = document.getElementById('barcode-scanner');

      div.removeChild(video);
      div.removeChild(canvas);
      div.removeChild(br);

      let progressDiv = document.getElementById('progressBar');
      let progess = document.getElementById('prog2');
      let progess2 = document.getElementById('progBar');

      progess.removeChild(progess2);
      progressDiv.removeChild(progess);
    } else {
      template.feedVideo.set(true);
      let divProgressBar = document.getElementById('progressBar');
      let progressMain = document.createElement('div');
      progressMain.className = 'progress';
      progressMain.id = 'prog2';
      let progressSecondary = document.createElement('div');
      progressSecondary.className =
        'progress-bar bg-info progress-bar-animated';
      progressSecondary.id = 'progBar';
      progressSecondary.setAttribute('role', 'progressbar');
      progressSecondary.setAttribute('aria-valuenow', '1');
      progressSecondary.setAttribute('aria-valuemin', '0');
      progressSecondary.setAttribute('aria-valuemax', '100');
      progressSecondary.style.width = '0%';
      progressMain.appendChild(progressSecondary);
      divProgressBar.appendChild(progressMain);
      load_quagga();
    }
  },
});

Template.scan.events({
  'click #retourScan': function (e) {
    if (Quagga.initialized != undefined) {
      Quagga.stop();
    }
    e.preventDefault();
    Session.set('accessedScan', '/vente/0');
    FlowRouter.go(Session.get('accessedScan'));
  },
});

function searchGoodreads() {
  Meteor.call(
    'scrapeBook',
    `https://www.goodreads.com/search/index.xml?key=qAcYmYvPix9QPfBwUXOoQ&q=${code}`,
    (error, result) => {
      console.log(result, error);
      if (result[0] != '') {
        Swal.fire({
          type: 'success',
          background: '#3A3F44',
          confirmButtonColor: 'rgb(156, 164, 170)',
          cancelButtonColor: 'rgb(92, 98, 102)',
          html: `<h2 style="color:#e9ecef">Nouveaux résultats</h2>
                        <p style="color:#e9ecef">
                            Le livre suivant a été trouvé: ${result[0]}.
                        </p>`,
          confirmButtonText: "C'est mon livre !",
          showCancelButton: true,
          cancelButtonText: 'Créer une annonce vide',
          preConfirm: () => {
            FlowRouter.go(`/vente/${code}`);
            Session.set('method', 'gr');
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            FlowRouter.go(`/vente/0`);
          }
        });
      } else if (error) {
        Swal.fire({
          type: 'error',
          background: '#3A3F44',
          confirmButtonColor: 'rgb(156, 164, 170)',
          cancelButtonColor: 'rgb(92, 98, 102)',
          html: `<h2 style="color:#e9ecef">Aucun livre n'a été trouvé !</h2>
                        <p style="color:#e9ecef">
                            ${error.message}.
                        </p>`,
          confirmButtonText: 'Réessayer',
          showCancelButton: true,
          cancelButtonText: 'Annuler',
          preConfirm: () => {
            // instance.set(true);
            Session.set('newTry', true);
            load_quagga();
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            FlowRouter.go(`/vente/0`);
          }
        });
      } else {
        Swal.fire({
          type: 'error',
          background: '#3A3F44',
          confirmButtonColor: 'rgb(156, 164, 170)',
          cancelButtonColor: 'rgb(92, 98, 102)',
          html: `<h2 style="color:#e9ecef">Aucun livre n'a été trouvé !</h2>
                        <p style="color:#e9ecef">
                            Aucune nos bases de données ne contient votre livre. Ou alors, votre ISBN est erroné.
                        </p>`,
          confirmButtonText: 'Réessayer',
          showCancelButton: true,
          cancelButtonText: 'Annuler',
          preConfirm: () => {
            // instance.set(true);
            Session.set('newTry', true);
            load_quagga();
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            FlowRouter.go(`/vente/0`);
          }
        });
      }
    }
  );
}

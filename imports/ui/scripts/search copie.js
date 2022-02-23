import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
// import "../../api/scraping.js";
import Swal from 'sweetalert2';

import '../templates/formulaireVente.html';

Template.formVente.onCreated(function(){
    let isbn = FlowRouter.getParam('isbn');
    Swal.fire({
        text: `Search for ${isbn}`,
        confirmButtonText: 'Confirm',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return fetch(`https://www.googleapis.com/books/v1/volumes?q=${isbn}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    let res = response.json()
                    return res
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                })
            }
        }
    ).then((result) => {
        if(result.value) {
            Swal.fire({
                type: "info",
                title: result.value.items[0].volumeInfo.title,
            })
        }
    })
    Meteor.call('scrapeBook', `https://www.goodreads.com/search/index.xml?key=qAcYmYvPix9QPfBwUXOoQ&q=${isbn}`, (error, result) => {
        if(result){
            Session.set("gr", result);
        }
        if (error) {
            Swal.fire({
                type: 'error',
                title: "Une erreur s'est produite",
                text: error.message,
            });
        }
    })
})

Template.formVente.helpers({
    alert(){
        Swal.fire({
            type: "warning",
            text: "Please wait"
        })
    },
    title: function(){
        return Session.get("title")
    }
})
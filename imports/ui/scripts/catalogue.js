import { Template } from "meteor/templating";
import { Session } from 'meteor/session';
import Swal from 'sweetalert2';

import "../templates/mainPage.html";

Template.mainPage.onCreated(function(){
     Meteor.call("livre.getAll", function(err, val){
          if(err){
               console.log(err)
          }else{
               console.log(val)
               Session.set("livres", val)
          }
     })
}),

Template.mainPage.helpers({
     "elements": function(){
          return Session.get("livres")
     },
     "query": () => Session.get("query") ? true : false
})

Template.mainPage.events({
    'click .item-row': function(evt) {
        evt.preventDefault();
        let pathAccessBook = "/livre/" + this._id;
        Session.set("accessedBook", "/uniBooks")
        FlowRouter.go(pathAccessBook);
    },
    "click #vendreLivre": function(event){
        event.preventDefault();
        FlowRouter.go("/scanner");
    },
    "click #myBtn": () => topFunction(),
    "submit form": function(event){
          event.preventDefault();
          const queryParam = event.target.sideBarQuerySelection.value;
          const query = event.target.sideBarQuery.value;
          const querySection = event.target.sideBarFaculty.value;

          if (query != "") {
               Meteor.call("livre.getQuery", queryParam, query, querySection, function(err, val){
                    if (err) {
                         Swal.fire(err.message);
                    }else{
                         Session.set("livres", val);
                         Session.set("query", true);
                    }
               })
          } else {
               Swal.fire({
                    type: "error",
                    background: "#3A3F44",
                    confirmButtonColor: "rgb(156, 164, 170)",
                    html:
                         `<h2 style="color:#e9ecef">Erreur !</h2>
                         <p style="color:#e9ecef">
                              Recherche manquante pour "${queryParam}".
                         </p>`,
               })
          }
     },
     "click #cancelQuery": function(event){
          event.preventDefault();

          Meteor.call("livre.getAll", function(err, val){
               if(err){
                    console.log(err)
               }else{
                    console.log(val)
                    Session.set("livres", val)
                    Session.set("query", false)
               }
          })
     }
})

// Faire apparaître le bouton "Haut de la page" quand l'utilisateur scroll vers le bas
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}



// Quand l'utilisateur clique sur le bouton "Haut de la page" -> le renvoyer au haut de la page
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
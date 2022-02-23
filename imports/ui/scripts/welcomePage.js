import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from "meteor/templating";

import "../templates/welcome.html";

Template.welcome.events({
    "click #seConnecter": function(e){
        e.preventDefault();
        FlowRouter.go("signIn")
    },
    "click #creerCompte": function(e){
        e.preventDefault();
        FlowRouter.go("signUp")
    }
})
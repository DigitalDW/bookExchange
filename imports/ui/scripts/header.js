import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Template } from "meteor/templating";

import "../templates/header.html"
import "../templates/userButton.html"

Template.userButton.helpers({
    mail: () => Meteor.user().emails[0].address
})

Template.userButton.events({
	'click #logout': function(event){
		event.preventDefault();
		Meteor.logout();
		FlowRouter.go("/")
	},
	'click #btnAnnonces': function(event){
		event.preventDefault();
		FlowRouter.go("/mes_annonces")
	},
    // "click #connect": function(event){
	// 	event.preventDefault();
	// 	FlowRouter.go("/sign_in")
    // },
    // "click #createAccount": function(event){
	// 	event.preventDefault();
	// 	FlowRouter.go("/sign_up")
    // },
});

Template.header.events({
	"click #headerText": () => {
		if(Meteor.userId()){
			FlowRouter.go("/uniBooks");
		}else{
			FlowRouter.go("/")
		}
	} 
})
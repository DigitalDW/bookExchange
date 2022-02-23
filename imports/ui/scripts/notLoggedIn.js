import { Template } from 'meteor/templating';
import "../templates/notLoggedIn.html"

Template.notLoggedIn.events({
    "click #erreur": () => {
        FlowRouter.go("/")
    }
})
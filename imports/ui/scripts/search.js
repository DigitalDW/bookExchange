import { Template } from 'meteor/templating';

import '../templates/search.html'

Template.search.onCreated(function(){
    let isbn = FlowRouter.getParam('isbn');
    let title = "";
    $.get(`https://www.googleapis.com/books/v1/volumes?q=${isbn}`, function(res){
        Session.set("title", res.items[0].volumeInfo.title)
    })
})

Template.search.helpers({
    title: function(){
        return Session.get("title")
    }
})
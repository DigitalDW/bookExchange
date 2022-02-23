import { Meteor } from 'meteor/meteor';
import '../imports/api/livresDB.js';
import '../imports/api/scraping.js';
import '../imports/api/mails.js';

Meteor.startup(() => {
  // code to run on server at startup
  process.env.MAIL_URL = "smtp://postmaster@sandbox25bbbdca054548dcba264c8d19d0db30.mailgun.org:2178c107806f773bb39493824f4d8d8c-39bc661a-e4814cf2@smtp.mailgun.org:587"
});

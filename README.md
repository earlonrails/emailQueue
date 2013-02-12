emailQueue
==========

Queue up emails to be sent with a delay using an http post.

Clone & Install

    npm install

Configure mail command. Currently mail/mailx and mutt are supported.
Mac usually will have mail installed already. To use mutt:

    brew install mutt

Or on Ubuntu

    sudo apt-get install mutt

*Optional:* Edit the `lib/emailQueue/mailCommand.json` file. Default is to use mail.

Start a server.

    node app.js

Navigate to [localhost:8000/email_list](localhost:8000/email_list) to view.

Send a test email request.

    wget --post-data 'body=foo&from=bar&to=foo&subject=bar&delayTime=10000' -qO - http://localhost:8000/email


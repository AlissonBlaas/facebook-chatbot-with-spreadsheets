# facebook-chatbot-with-spreadsheets
facebook chatbot with google spreadsheets and some filter with buttons into facebookchat

all code are into bot.js

a special thanks to christopher moura: https://github.com/ccmoura
for help me.

You will need this dependences: NODEJS, EXPRESS, BODY-PARSER, GOOGLE-SPREADSHEETS

<h2>THIS IS NOT THE ORIGINAL CODE, THE ORIGINAL CODE YOU CAN CHECK INTO MY FACEBOOK PAGE, ONLY RUNNING</h2>
chatbot test here: https://www.facebook.com/fixxerServices/
<h4>this is only a test code, for help some people to connect and filter the spreadsheets into messenger</h4>

<h3>How to connect you facebook api with chatbot</h3>
Here: https://developers.facebook.com/docs/messenger-platform/guides/quick-start

<h3>How to get credentials from google spreadsheets</h3>
with images: https://imgur.com/a/SGeAeFD


to add a start message, you can use this into you console.

```curl -X POST -H "Content-Type: application/json" -d '{
  "greeting": [
    {
      "locale":"default",
      "text":"Welcome {{user_first_name}} to this page" 
    }

}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<YOU PAGE ACCESS TOKEN>"

AND THIS:


curl -X POST -H "Content-Type: application/json" -d '{ 
  "get_started":{
    "payload":"Start"
  }
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<YOU PAGE ACCESS TOKEN>"

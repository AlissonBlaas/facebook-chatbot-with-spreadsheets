//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.

//connect with npm spreadsheets
'use strict';
const GoogleSpreadsheet = require('google-spreadsheet');
const credentials = require('./credentials.json');
const {promisify} = require('util');

//connect for node
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var messengerButton = "teste";


const docId = '<your id from spreadsheets>' // you can get by you spreadsheets link, like here :https://docs.google.com/spreadsheets/d/<your spreadsheets id>
const doc = new GoogleSpreadsheet('docId')
 
 // authentication google spreadsheets
let accessSheet = async() => {
    const doc = new GoogleSpreadsheet(docId)
    await promisify(doc.useServiceAccountAuth)(credentials)
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    const rows = await promisify(worksheet.getRows)({
      
    })

    this.filterPeoples = (key => {
    let peoples = "spreadsheets: \n\n"
    let x = 1
    rows.forEach((row) => {
            if((row.name).toLowerCase() === 'pelotas') {
                if((row.tags).toLowerCase().includes(key.toLowerCase())) {
                  peoples += `${x} - ` + 
                        //this par below, will filter you spreadsheets. Here we have a spreadsheets example with name and city
                            `${row.name}\n` + 
                            `${row.city}\n`
                            peoples += '\n\n'
                  x += 1
                }
            }
    
    }) 
                            
    return (employees === "peoples filter below: \n\n" ? `no professional register ${key}` : employees)
   })
}
 accessSheet()
 
// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Webhook validation
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

// Display the web page
app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(messengerButton);
  res.end();
});

// Message processing
app.post('/webhook', function (req, res) {
  console.log(req.body);
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
      if(event.message){
           receivedMessage(event);
        } else{
            PostbackMenu(event);
        }
      }); 
    });
    
    
    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

let PostbackMenu = (event) => {
    if (event.postback && event.postback.payload){
      //switch case for filter facebook json, and some of the 
              switch (event.postback.payload.toLowerCase()) {
                case 'atendente':
                    sendTextMessage(event.sender.id, 'Obrigado pelo contato, entraremos em contato o mais rápido possível!');
                  break;
                  
                   case 'prestadores':   
                    searchMenu(event.sender.id);
                    break;
                   case 'trabalhe':
                    sendTextMessage(event.sender.id, 'Para tornar-se um trabalhador preencha o nosso formulário.\nhttp://bit.ly/2JQGggy');
                    MenuExitTimer(event.sender.id);
                    break;
                  case 'beleza':   
                    sendTextMessage(event.sender.id, this.filterPeoples('beleza'));
                    MenuExitTimer(event.sender.id);
                    break;

                  case 'frete':
                    sendTextMessage(event.sender.id, this.filterPeoples('frete'));
                    MenuExitTimer(event.sender.id);
                    break;

                  case 'assistencia tecnica':
                    sendTextMessage(event.sender.id, this.filterPeoples('assistencia tecnica'));
                    MenuExitTimer(event.sender.id);
                    break;
                  
                  case 'eletricista':
                    sendTextMessage(event.sender.id, this.filterPeoples('eletricista'));
                    MenuExitTimer(event.sender.id);
                    break;
                  
                  case 'continuar':
                   sendFirstMenu(event.sender.id);
                  break;
                  
                   case 'não':   
                    sendTextMessage(event.sender.id, 'Agradecemos o contato, até a proxima. Caso queira voltar ao inicio, digite novamente, Começar');
                    break;
                  
                default:
                      sendFirstMenu(event.sender.id);
            }
        /*if(haveMatched == true){
          menuExitTimer(event.sender.id)
        }*/
      }
}

//menu
let MenuExitTimer = (event =>{
    setTimeout(function (){
    MenuExit(event)
}, 2500)
})


// Incoming events handling
let receivedMessage = (event => {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    //condição para o switch
    switch (messageText) {
      case 'oi':   
        sendTextMessage(senderID, 'Olá, tudo bem?');
        break;
        
      case 'tudo bem, e voce?':  
        case 'tudo bem e voce?':
        sendTextMessage(senderID, 'Estou bem também :D, seja bem vindo.');
        break;
      case 'tchau':
        sendTextMessage(senderID, 'até a proximo, se cuide!');
        break;
        
      case 'This is a test message from the Facebook team. Please respond from your app within 2 days to confirm that the integration is functioning.':
        sendFirstMenu(event.sender.id);
        break;
      case 'começar':
      case 'comecar':
        sendFirstMenu(event.sender.id);
        break
      default :
        sendTextMessage(senderID, `Não entendi.\nTente digitar 'Começar'`)
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, 'Qual a pergunta?');
  }
})



//////////////////////////
// Sending helpers
//////////////////////////
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

let searchMenu = (recipientId) =>{
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "💅 | 💻",
          buttons: [
          {
            type: "postback",
            title: "Serviço de beleza",
            payload: "beleza",               
            
          },
          {
            type: "postback",
            title: "Assistencia Tecnica",
            payload: "assistencia tecnica", 
          },
            
        ]
        }
      }
    }
  };
  callSendAPI(messageData);

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "🔌 | 🚛",
          buttons: [
          {
            type: "postback",
            title: "Eletricista",
            payload: "eletricista",               
            
          },
                    
          {
            type: "postback",
            title: "Frete",
            payload: "frete", 
          },        
        ]
        }
      }
    }
  };
  callSendAPI(messageData);
}

function sendFirstMenu(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Seja bem vindo, eu sou o robo da fixxer, em que posso lhe ajudar?",
          buttons: [
          {
            type: "postback",
            title: "Falar com atendente",
            payload: "atendente",               
            
          },
          {
            type: "postback",
            title: "Contratar um serviço",
            payload: "prestadores", 
          },
            
          {
            type: "postback",
            title: "Tornar-se um trabalhador",
            payload: "trabalhe", 
          },
            
        ]
        }
      }
    }
  };
  callSendAPI(messageData);
}

function MenuExit(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Deseja mais alguma coisa?",
          buttons: [
          {
            type: "postback",
            title: "Sim, continuar",
            payload: "continuar",               
            
          },
          {
            type: "postback",
            title: "Não, obrigado",
            payload: "não", 
          },           
        ]
        }
      }
    }
  };
  callSendAPI(messageData);
}



function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});
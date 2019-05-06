require('dotenv').config()
const Discord = require('discord.js')
const request = require('request');

const client = new Discord.Client()
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (isBotChannel(msg)) {
    console.log("\n\n\n\n\n------")
    let attachments = getAttachments(msg);

    if (attachments.length !== 0) {
      let attachmentURL = attachments[0].url;
      console.log(attachmentURL);
      // postToAppsScript(attachmentURL);
      postToAppsScript(attachmentURL, function(data) {
        msg.reply(data);
      })
    }
  }
})

client.login(process.env.BOT_TOKEN)

function isBotChannel(msg) {
  return msg.channel.name == 'bot';
}
function getAttachments(msg) {
  let attachments = msg.attachments.array();
  return attachments;
}
function postToAppsScript(attachmentURL, cb) {
  const postContent = {
    entry: [
      {
        messaging: [
          {
            sender: {
              id: 'discord'
            },
            message: {
              attachments: [
                {
                  payload: {
                    url: attachmentURL
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  };
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/' + process.env.APPS_SCRIPT_ID + '/exec';

  request.post({
    url: APPS_SCRIPT_URL,
    json: postContent,
    followAllRedirects: true
  },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('post failed:', err);
      }
      console.log(body);
      cb(body);
    }
  );
}
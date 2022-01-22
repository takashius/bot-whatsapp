require('dotenv').config()
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

const SESSION_FILE_PATH = "./session.json";

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
});

client.initialize().catch(console.log);

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", msg => {
  console.error('AUTHENTICATION FAILURE', msg);
})

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", message => {
  if (message.body === "Te quiero") {
    client.sendMessage(message.from, `*Yo tambien*
    _Otra parte_ 
    🥰😍😘`);
    // client.sendMessage('584125557916@c.us', '*TE AMO* 🥰😍😘 (con emoticones)');
    // client.sendMessage('5491121925253@c.us', 'Test numero personalizado desde api 🥰😍😘');
  }
});

module.exports = client;
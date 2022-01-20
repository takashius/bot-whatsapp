const express = require('express');
const { add } = require('nodemon/lib/rules');
const wa = require('./bot-whatsapp');
const cors = require('cors');
const bodyParser = require('body-parser');

const webApp = express();
webApp.use(bodyParser.urlencoded({
  extended: true
}));
webApp.use(bodyParser.json());
webApp.use(cors());

const PORT = process.env.PORT;

webApp.get('/', (req, res) => {
  res.send(`Hello World.!`);
});

webApp.post('/', (req, res) => {
  try{
    const {driver, load} = req.body;
    const toSend = `${driver.areacode}${driver.phoneNumber}@c.us`;
    const broker = load.broker;

    let pickup = formatAddressIn(load.address_in, broker);
    let delivery = formatAddressOut(load.address_out, broker);

    const message = `
            _*NEW LOAD ASIGNED*_

*Number Load*: ${load.loadNumber}
*Commodity*: ${load.commodity}
*Load Weigth*: lb ${load.loadWeigth}
*Gross Weight*: lb ${load.grossWeight}

*RECOGIDA*
${pickup}

*ENTREGA*
${delivery}`;
    wa.sendMessage(toSend, message);
    res.status(200).send(`Mensaje enviado a ${toSend}`);
  }catch(e){
    console.log(e);
    res.status(500).send(`Unexpected error: ${e}`);
  }
});

const formatAddressIn = (address_in, broker) => {
  let pickup = '';
  address_in.map((address) => {
    const direction = address.address_id;
    if(address){
      pickup = `${pickup}
${address.date}
${address.time}

${direction.title}
${direction.address}
${direction.address2} ${direction.zipCode}

PickUp#
${address.refNumber}

Broker: ${broker.brokerName} ${broker.mcNumber}`;
    }
    
  });

  return pickup;
}

const formatAddressOut = (address_out, broker) => {
  let delivery = '';
  address_out.map((address) => {
    const direction = address.address_id;
    if(address){
      delivery = `${delivery}
${address.date}
${address.time}

${direction.title}
${direction.address}
${direction.address2} ${direction.zipCode}

DELIVERYPO# 
${direction.refNumber}

Broker: ${broker.brokerName} ${broker.mcNumber}`;
    }
  });

  return delivery;
}

// Start the server
webApp.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});
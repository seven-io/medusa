<img src="https://www.seven.io/wp-content/uploads/Logo.svg" width="250" />



# [seven](https://www.seven.io) plugin for [medusa](https://www.medusajs.com/)

## Installation

### Via Yarn

`yarn add @seven.io/medusa`

### Via NPM

`npm install @seven.io/medusa`

## Setup

After installing, add your credentials to `.env`:

````dotenv
SEVEN_API_KEY="<YOUR_API_KEY>" # see https://help.seven.io/en/api-key-access
````

The last step is to add the plugin and its options to the `plugins` array in the `medusa-config.js`
file:

```js
const plugins = [
    //...
    {
        resolve: '@seven.io/medusa',
        options: {
            apiKey: process.env.SEVEN_API_KEY,
            sms: {
                flash: true, // optionally send as flash - see https://help.seven.io/en/flash-sms
                from: 'Medusa', // sender ID - see https://help.seven.io/en/set-sender-id
            },
            voice: {
                json: true, // if true, the API returns a detailed JSON response
                from: '+49179876543210', // must be verified (see https://app.seven.io/settings#callerid) or a shared number (see https://help.seven.io/en/shared-numbers)
            }
        },
    }
]
```

## Usage

### Dynamic usage

The seven service can be resolved dynamically for sending SMS and making text-to-speech calls.

Example:

```js
const sevenService = scope.resolve("sevenService")

// send SMS
sevenService.sendSms({
    from: 'Medusa', // optional
    text: "Dear customer!",
    to: "+49179876543210",
    // optionally add more parameters according to the documentation at https://www.seven.io/en/docs/gateway/http-api/sms-dispatch/
})

// make a text-to-speech call
sevenService.sendVoice({
    from: '+49179876543210', // optional
    text: "Dear customer!",
    to: "+49179876543210",
    // optionally add more parameters according to the documentation at https://www.seven.io/en/docs/gateway/http-api/voice/
})
```

### Subscription based usage

This example demonstrates how to send an SMS after an order has been placed.

````js
export default class SmsSubscriber {
    constructor({
                    eventBusService,
                    orderService,
                    sevenService,
                }) {
        this.sevenService_ = sevenService;
        this.orderService = orderService;

        eventBusService.subscribe('order.placed', this.sendSMS);
    }

    sendSMS = async ({id}) => {
        const {shipping_address} = await this.orderService.retrieve(id, {
            relations: ['shipping_address']
        })

        if (!shipping_address.phone) return

        this.sevenService_.sendSms({
            from: 'MyStore',
            text: `Thanks your order with ID #${id}. We will inform you right after shipping.`,
            to: shipping_address.phone,
        })
    }
}
````

### Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/).

[![MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

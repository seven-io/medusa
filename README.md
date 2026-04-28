<p align="center">
  <img src="https://www.seven.io/wp-content/uploads/Logo.svg" width="250" alt="seven logo" />
</p>

<h1 align="center">seven SMS for Medusa</h1>

<p align="center">
  Send SMS and place text-to-speech calls from your <a href="https://medusajs.com/">Medusa</a> commerce backend via the seven gateway.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-teal.svg" alt="MIT License" /></a>
  <a href="https://www.npmjs.com/package/@seven.io/medusa"><img src="https://img.shields.io/npm/v/@seven.io/medusa" alt="npm" /></a>
  <img src="https://img.shields.io/badge/Medusa-1.x-blue" alt="Medusa 1.x" />
</p>

---

## Features

- **SMS & Voice Service** - `sevenService.sendSms()` / `sevenService.sendVoice()` available across the Medusa container
- **Subscription-based Sending** - Hook into Medusa events (e.g. `order.placed`) to fire SMS automatically
- **Per-Channel Defaults** - Configure default sender, flash flag and JSON-response flag per SMS / Voice channel

## Prerequisites

- [Medusa](https://medusajs.com/) backend
- A [seven account](https://www.seven.io/) with API key ([How to get your API key](https://help.seven.io/en/developer/where-do-i-find-my-api-key))

## Installation

```bash
yarn add @seven.io/medusa
# or
npm install @seven.io/medusa
```

## Configuration

### 1. Set the API key

```dotenv
SEVEN_API_KEY="<YOUR_API_KEY>"
```

### 2. Register the plugin in `medusa-config.js`

```js
const plugins = [
  // ...
  {
    resolve: '@seven.io/medusa',
    options: {
      apiKey: process.env.SEVEN_API_KEY,
      sms: {
        flash: true,                  // optional flash SMS - https://help.seven.io/en/flash-sms
        from: 'Medusa',               // sender ID - https://help.seven.io/en/set-sender-id
      },
      voice: {
        json: true,                   // detailed JSON response
        from: '+49179876543210',     // verified caller ID or shared number
      },
    },
  },
]
```

## Usage

### Resolve the service dynamically

```js
const sevenService = scope.resolve('sevenService')

await sevenService.sendSms({
  from: 'Medusa',
  text: 'Dear customer!',
  to:   '+49179876543210',
})

await sevenService.sendVoice({
  from: '+49179876543210',
  text: 'Dear customer!',
  to:   '+49179876543210',
})
```

### Subscribe to Medusa events

Send an SMS automatically once an order is placed:

```js
export default class SmsSubscriber {
  constructor({ eventBusService, orderService, sevenService }) {
    this.sevenService_ = sevenService
    this.orderService = orderService

    eventBusService.subscribe('order.placed', this.sendSMS)
  }

  sendSMS = async ({ id }) => {
    const { shipping_address } = await this.orderService.retrieve(id, {
      relations: ['shipping_address'],
    })

    if (!shipping_address.phone) return

    this.sevenService_.sendSms({
      from: 'MyStore',
      text: `Thanks for your order #${id}. We will inform you right after shipping.`,
      to:   shipping_address.phone,
    })
  }
}
```

See the seven [SMS](https://www.seven.io/en/docs/gateway/http-api/sms-dispatch/) and [Voice](https://www.seven.io/en/docs/gateway/http-api/voice/) API references for the full parameter list.

## Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/) or [open an issue](https://github.com/seven-io/medusa/issues).

## License

[MIT](LICENSE)

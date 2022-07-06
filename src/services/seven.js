import {BaseService} from 'medusa-interfaces'
import Sms77Client from 'sms77-client'

export default class SevenService extends BaseService {
    /**
     * @param {Object} options - options defined in `medusa-config.js`
     *    e.g.
     *    {
     *      apiKey: "MY_SUPER_SECRET_SEVEN_API_KEY",
     *      sms: {
     *          from: "Medusa"
     *      },
     *      voice: {
     *          from: "+491771783130"
     *      }
     *    }
     */
    constructor({}, options) {
        super()

        this.options_ = options

        this.client = new Sms77Client(options.apiKey, 'Medusa')
    }

    /**
     * @param {Object} data - seven SMS options
     */
    async sendSms(data) {
        return this.client.sms({
            ...this.options_.sms,
            ...data,
        })
    }

    /**
     * @param {Object} data - seven Voice options
     */
    async sendVoice(data) {
        return this.client.voice({
            ...this.options_.voice,
            ...data,
        })
    }
}
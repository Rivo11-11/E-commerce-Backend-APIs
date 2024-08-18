/* eslint-disable camelcase */
class APIerror extends Error {

    constructor(message,status_code) 
    {
        super(message)
        this.status_code = status_code 
        this.status = `${status_code}`.startsWith(4) ? 'Fail' : 'Error'
        this.operational = !!`${status_code}`.startsWith(4)
    }


}

module.exports = APIerror
'use strict'
class sanateError extends Error {
  constructor (message, status = 500, code) {
    super(message)
    this.code = code
    this.status = status
    this.error = {
      code: code,
      message: message
    }
  }
}

module.exports = (message, status, code) => new sanateError(message, status, code)

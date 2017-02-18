'use strict'

const IPController  = require('../../node-ip-controller'),
      Command       = require('./command'),
      processors    = require('./processors'),

      startStatus   = {
        'power':        false,
        'volume':       0,
        'volume.mute':  false,
        'channel':      0,
        'input':        null
      },

      defaultOptions = {
        port:       20060,
        terminator: "\n"
      }


module.exports = class BraviaIPController extends IPController {

  //
  constructor(options) {
    super(defaultOptions, options, startStatus, processors)

    var self = this
    this.on('connect', () => {
      this.requestBasics()
    })

    this.queue = []

  }


  /**
   * Request the basic properties of the receiver.
   */
  requestBasics() {
    var self = this
    this.request('power')
    this.request('volume')
    this.request('volume.mute')
    this.request('channel')
    this.request('input')
  }


  /**
   * 
   */
  getRequestCommand(prop) {
    var req = Command.get("request", prop)
    this.queue.push(req)
    return req
  }


  /**
   * 
   */
  getActCommand(prop, val) {
    var cmd = Command.get("action", prop)
    if (typeof val != 'undefined')
      cmd = cmd.replace("%s", Command.prepareValue("action", prop, val))
    this.queue.push(cmd)
    return cmd
  }


  /**
   *
   */
  processResponse(resp) {
    // Remove trailing newline
    resp = resp.replace(/\n$/, "")

    // Check if we have multiple lines
    var lines = resp.split("\n")
    if (lines.length > 1) return lines

    var match = resp.match( /^\*SA(\w{4})/ )
    if (match) {
      var cmd = this.queue.shift()
      var func = cmd.match( /^\*S(C|E)(\w{4})/ )[2]
      resp = resp.replace( /^(\*SA)\w{4}/, "$1" + func )
    }

    return resp
  }

}
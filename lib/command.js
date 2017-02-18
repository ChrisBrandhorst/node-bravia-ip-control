'use strict'

const Command = {

  // Requests
  request: {
    'power':        "POWR",
    'volume':       "VOLU",
    'volume.mute':  "AMUT",
    'channel':      "CHNN",
    'input':        "INPT"
  },

  // Actions
  action: {
    'power':        "POWR%s",
    'volume':       "VOLU%s",
    'volume.mute':  "AMUT%s",
    'channel':      "CHNN%s",
    'input':        "INPT%s"
  }

}

// 
Command.get = function(type, prop) {
  if (!Command[type]) throw new Error("Unknown command type:" + type)
  var cmd = Command[type][prop]
  if (typeof cmd == 'undefined') throw new Error("Unknown " + type + ": " + cmd)
  cmd = "*S" + (type == "request" ? "E" + cmd + pad('#', "") : "C" + cmd)
  return cmd
}

function pad(padding, val) {
  return (new Array(17).join(padding) + val).slice(-16)
}


//
Command.prepareValue = function(type, prop, val) {
  switch (prop) {
    case "channel":
      val = val + ".0000000"
      break
    case "input":
      val = val + "0000"
      break
    default:
  }

  switch (val) {
    case true:
    case "true":
      val = 1
      break
    case false:
    case "false":
      val = 0
      break
  }

  val = pad('0', val)

  return val
}

module.exports = Command
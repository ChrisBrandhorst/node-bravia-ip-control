'use strict'

/**
 * A Processor is created based on a property key, a regex which should match the
 * response coming over the socket and a proc function which states what should be
 * done with the response.
 * The proc method should return the value of the setting related to the command
 * and might adjust the status of the controller.
 */
module.exports = function(set){

// Power: true / false
set(
  'power',
  /^\*S(A|N)POWR0{15}(0|1)$/,
  (c,p,m,r) => {
    return c.set(p, m[2] == "1")
  }
)

// Volume: 0-100
set(
  'volume',
  /^\*S(A|N)VOLU(\d{16})$/,
  (c,p,m,r) => {
    return c.set(p, parseInt(m[2]))
  }
)

// Volume mute: true / false
set(
  'volume.mute',
  /^\*S(A|N)AMUT0{15}(0|1)$/,
  (c,p,m,r) => {
    return c.set(p, m[2] == "1")
  }
)

// Channel: 001-999
set(
  'channel',
  /^\*S(A|N)CHNN(\d{8})/,
  (c,p,m,r) => {
    return c.set(p, parseInt(m[2]))
  }
)

// Input: 0-6
set(
  'input',
  /^\*S(A|N)INPT0{7}(\d)0{4}(\d{4})/,
  (c,p,m,r) => {
    return c.set(p, parseInt(m[2]) + "." + parseInt(m[3]) )
  }
)

}
'use strict'

const BraviaController = require('../lib/bravia-ip-control')

var controller = new BraviaController({
  host: "10.1.1.80"
})

controller.on('update', (status) => {
  console.log(status)
  
})

controller.on('error', (err) => {
  console.error(err)
})

// Gebeurd na een paar minuten nadat TV uit is gezet
// Gebeurd als er geen verbinding gemaakt kan worden
controller.on('close', (had_error) => {
  console.error("Closed!")
})

controller.on('read', (response) => {
  console.log("--> " + response)
})

controller.on('write', (command) => {
  console.log(command + " -->")
})

controller.connect().then( (socket) => {
  
})

var stdin = process.stdin.setEncoding('utf8')
stdin
  .on('readable', function () {
    var chunk = stdin.read()
    if (chunk === null) return

    var cmd   = chunk.toString().replace(/[\n\r]*$/, ''),
        parts = cmd.split(" ")

    // try {
      controller.act(parts[0], parts[1])
      // controller.raw(cmd)
    // }
    // catch(e) {
    //   console.log("Unknown command: " + cmd)
    // }
  })

  .on('end', function () {
    log.info('Stdin closed..');
  });

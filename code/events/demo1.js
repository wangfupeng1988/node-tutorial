const EventEmitter = require('events').EventEmitter

const emitter1 = new EventEmitter()
emitter1.on('some', () => {
    console.log('some event is occured 1')
})
emitter1.on('some', () => {
    console.log('some event is occured 2')
})
emitter1.emit('some')
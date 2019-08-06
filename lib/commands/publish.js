const fs      = require('fs')
const chalk   = require('chalk')
const datapay = require('datapay')

// Functional Bitcoin protocol prefix
const protocolPrefix = '1AKyFQWGGrpj1Nwp6H6uUEercQP213zj3P';

module.exports = {
  run(argv) {
    console.log('Publishing function…')
    console.log('>', chalk.white(argv.filePath) + '\n')

    if ( this.isReady(argv) ) {
      this.sendTransaction(argv)
    }    
  },

  isReady(argv) {
    if ( !fs.existsSync(argv.filePath) ) {
      console.log('  ❗️', chalk.bold.red(`${argv.name}.lua function file not found`))
      return false;
    }
    if ( !process.env.ADDRESS || !process.env.PRIVATE ) {
      console.log('  ❗️', chalk.bold.red("Please run 'fb init' to generate a keypair"))
      return false;
    }
    return true;
  },

  buildPayload(argv) {
    const script  = fs.readFileSync(argv.filePath, { encoding: 'utf8' }),
          data    = [protocolPrefix, argv.name, script];
    if ( argv.tag ) data.push(argv.tag);
    return {
      data,
      pay:  { key: process.env.PRIVATE }
    }
  },

  sendTransaction(argv) {
    const payload = this.buildPayload(argv)
    datapay.send(payload, function(err, tx) {
      if (err) console.log('ERR', err);
      if (tx) console.log('TX', tx);
    })
  }
}
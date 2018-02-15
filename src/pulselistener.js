var taskcluster = require('taskcluster-client');
var hookApi     = require('./v1');
var assert      = require('assert');

/**
 * Create a listener to trigger hooks with pulse messages 
 *
 * options:
 * {
 *   credentials:        // Pulse guardian credentials
 *   queueName:          // Queue name 
 *   exchange:           // any available exchange in pulse.mozilla.org 
 *   (reference to exchages => https://wiki.mozilla.org/Auto-tools/Projects/Pulse/Exchanges) 
 *   routingKeyPattern:         // you can filter messages arrived from a specific exchange using a 
 *   routingKeyPattern, by default: #
 * }
 */
class PulseMessages {
  constructor({credentials, queueName, exchange, routingKeyPattern, Hook, taskcreator}) {
    this.Hook = Hook;
    this.taskcreator = taskcreator;
    this.credentials = credentials;
    this.queueName = queueName;
    this.exchange = exchange;
    this.routingKeyPattern = routingKeyPattern;
  }
  /**
   * Set up the pulse message listener.
  */

  async setup(options) {
    options = options || {};
    
    assert(!this.connection, 'You can not setup twice!');
    this.connection = new taskcluster.PulseConnection({
      username: this.credentials.username,
      password: this.credentials.password,
    });

    var allHooks = await this.Hook.scan({});
    console.log('All hooks:', allHooks);
    /*
      if (hook.pulseExchanges.length > 0) {        
        var listener = new taskcluster.PulseListener({
          connection: this.connection,
          queueName: [hook.hookGroupId, '/', hook.hookId].join(''),
        });
        
        hook.pulseExchanges.forEach(pulses => {
          console.log('Binding now: ', pulses.exchange);
          listener.bind({
            exchange: pulses.exchange, 
            routingKeyPattern: pulses.routingKeyPattern,
          });
        });
      }
    }});*/
   
    listener.on('message', (message) => {
      console.log(message);
      this.taskcreator.fire(hook, message.payload);
    });
    listener.resume();
  }

}

module.exports = PulseMessages;
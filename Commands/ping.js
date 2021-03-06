const ping = require('ping');

/**
 * @usage !ping
 * @does checks ping to different Servers
 */
module.exports = {
   ping: function (message) {

      const hosts = ['status.discordapp.com', 'google.com'];

      hosts.forEach(function (host) {

         ping.promise.probe(host).then(function (res) {

            message.channel.send(res.host + ' ' + res.time + 'ms');
         })
      })
   }
}

const fs = require('fs');
const join = require('path').join;
require('colorslite');
const messages = [
  { regex: /]: (<([\w]+)> ~(.+)$)/, channel: 'command' },
  { regex: /]: (<([\w]+)> (.+)$)/, channel: 'chat' },
  { regex: /\[User Authenticator #1\/INFO]: (.+$)/, channel: 'info' },
  { regex: /\[Server thread\/INFO]: (Found (.+)$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (The block at (.+)$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (Failed to execute (.+)$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (Teleported (.+)$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (Playing effect (.+)$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (Played sound (.+)$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (\[([\w\_]+): Playing (.+)$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (Set the time to [\d]+)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: ([\w_]+ did not match the required .+$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (There are [\d\/]+ players online:$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (Given \[.+\] .+ to [\w_]+$)/, channel: 'verbose' },
  { regex: /\[Server thread\/INFO]: (.+$)/, channel: 'info' },
  { regex: /\[Server thread\/WARN]: (.+$)/, channel: 'warn' },
];

module.exports = function() {
  const server = this;

  const logFile = fs.createWriteStream(join(process.cwd(), 'logs', 'ss.log'));
  server.log = function(...args) {
    args.unshift('['.gray + 'SS'.blue + ']'.gray);
    console.log.apply(console.log, args);
  }

  const infoLogFile = fs.createWriteStream(join(process.cwd(), 'logs', 'ssInfo.log'));
  server.log.info = function(...args) {
    logFile.write(args.join(' ') + '\n');
    infoLogFile.write(args.join(' ') + '\n');
    args.unshift('['.gray + 'info'.green + ']'.gray);
    server.log.apply(server, args);
  }

  const warnLogFile = fs.createWriteStream(join(process.cwd(), 'logs', 'ssWarn.log'));
  server.log.warn = function(...args) {
    logFile.write(args.join(' ') + '\n');
    warnLogFile.write(args.join(' ') + '\n');
    args.unshift('['.gray + 'warn'.yellow + ']'.gray);
    server.log.apply(server, args);
  }

  const verboseLogFile = fs.createWriteStream(join(process.cwd(), 'logs', 'ssVerbose.log'));
  server.log.verbose = function(...args) {
    logFile.write(args.join(' ') + '\n');
    verboseLogFile.write(args.join(' ') + '\n');
    args.unshift('['.gray + 'verbose'.magenta + ']'.gray);
    server.log.apply(server, args);
  }

  const commandLogFile = fs.createWriteStream(join(process.cwd(), 'logs', 'ssCommand.log'));
  server.log.command = function(...args) {
    logFile.write(args.join(' ') + '\n');
    commandLogFile.write(args.join(' ') + '\n');
    args.unshift('['.gray + 'command'.cyan + ']'.gray);
    server.log.apply(server, args);
  }

  const chatLogFile = fs.createWriteStream(join(process.cwd(), 'logs', 'ssChat.log'));
  server.log.chat = function(...args) {
    logFile.write(args.join(' ') + '\n');
    chatLogFile.write(args.join(' ') + '\n');
    args.unshift('['.gray + 'chat'.lYellow + ']'.gray);
    server.log.apply(server, args);
  }

  server.on('console', data => {

    data.split('\n').forEach(l => {
      if (!l) return;

      let channel = messages.reduce((c, r) => {
        if (c) return c;
        else {
          let result = l.match(r.regex);
          if (result) {
            l = result[1];
            return r.channel;
          } else return null;
        }
      }, null);
      if (server.log.hasOwnProperty(channel)) server.log[channel](l);
      else server.log(l);

    });
  });
}
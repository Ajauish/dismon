const WebSocket = require('ws');

class Client {
  constructor(token) {
    this.listeners = {};

    Object.defineProperty(this, 'token', {
      value: token,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }

  connect() {
    // Open a WebSocket connection to the Discord API
    const socket = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
    
    // Listen for the WebSocket connection to open
    socket.on('open', () => {

      // Send the identify payload to authenticate the connection
      socket.send(JSON.stringify({
        op: 2,
        d: {
          token: this.token,
          intents: 3276799,
          properties: {
            $os: 'linux',
            $browser: 'dislog',
            $device: 'dislog'
          }
        }
      }));
    });

    // Listen for messages from the Discord API
    socket.on('message', (data) => {
      const message = JSON.parse(data);
      JSON.stringify(message);

      switch (message.op) {
        case 10: // Start the heartbeat interval
          setInterval(() => {
            socket.send(JSON.stringify({
              op: 1,
              d: null
            }));
          }, message.d.heartbeat_interval);
          break;
        case 0: // Dispatch event
          const eventName = message.t;
          const eventData = message.d;
          
          // Call all this.listeners for this event
          if (eventName in this.listeners) {
            this.listeners[eventName].forEach((listener) => {
              listener(eventData);
            });
          }
          break;
      }
    });

    // Listen for the WebSocket connection to close
    socket.on('close', (code, reason) => {
      console.log(`WebSocket connection closed with code ${code}: ${reason}`);
    });

    // Listen for errors in the WebSocket connection
    socket.on('error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  addLogger(eventName, listener) {
    if (!(eventName in this.listeners)) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(listener);
  }

  removeLogger(eventName, listener) {
    if (eventName in this.listeners) {
      const index = this.listeners[eventName].indexOf(listener);
      if (index !== -1) {
        this.listeners[eventName].splice(index, 1);
      }
    }
  }

  logChannel(channelId) {
    this.addLogger('CHANNEL_CREATE', (data) => {
      if (data.id === channelId) {
        console.log(`Channel created: ${data.name} (${data.id})`);
      }
    });

    this.addLogger('CHANNEL_UPDATE', (data) => {
      if (data.id === channelId) {
        console.log(`Channel updated: ${data.name} (${data.id})`);
      }
    });

    this.addLogger('CHANNEL_DELETE', (data) => {
      if (data.id === channelId) {
        console.log(`Channel deleted: ${data.name} (${data})`);
      }
    });

    this.addLogger('CHANNEL_PINS_UPDATE', (data) => {
      if (data.channel_id === channelId) {
        console.log(`Channel pins updated: ${data.channel_id}`);
      }
    });

    this.addLogger('MESSAGE_CREATE', (data) => {
      if (data.channel_id === channelId) {
        console.log(`Message created in ${data.channel_id}: ${data.content}`);
      }
    });

    this.addLogger('MESSAGE_UPDATE', (data) => {
      if (data.channel_id === channelId) {
        console.log(`Message updated in ${data.channel_id}: ${data.content}`);
      }
    });

    this.addLogger('MESSAGE_DELETE', (data) => {
      if (data.channel_id === channelId) {
        console.log(`Message deleted in ${data.channel_id}: ${data.id}`);
      }
    });

    this.addLogger('MESSAGE_DELETE_BULK', (data) => {
      if (data.channel_id === channelId) {
        console.log(`Bulk message delete in ${data.channel_id}: ${data.ids}`);
      }
    });

    this.addLogger('MESSAGE_REACTION_ADD', (data) => {
      if (data.channel_id === channelId) {
        console.log(`Reaction added in ${data.channel_id}: ${data.emoji.name}`);
      }
    });

    this.addLogger('MESSAGE_REACTION_REMOVE', (data) => {
      if (data.channel_id === channelId) {
        console.log(`Reaction removed in ${data.channel_id}: ${data.emoji.name}`);
      }
    });

    this.addLogger('MESSAGE_REACTION_REMOVE_ALL', (data) => {
if (data.channel_id === channelId) {
        console.log(`All reactions removed in ${data.channel_id}`);
      }
    });
  }

  logServer(guildId) {
    this.addLogger('GUILD_CREATE', (data) => {
      if (data.id === guildId) {
        console.log(`Guild created: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('GUILD_UPDATE', (data) => {
      if (data.id === guildId) {
        console.log(`Guild updated: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('GUILD_DELETE', (data) => {
      if (data.id === guildId) {
        console.log(`Guild deleted: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('GUILD_MEMBER_ADD', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Member added to ${data.guild_id}: ${data.user.username}#${data.user.discriminator}`);
      }
    });
  
    this.addLogger('GUILD_MEMBER_REMOVE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Member removed from ${data.guild_id}: ${data.user.username}#${data.user.discriminator}`);
      }
    });
  
    this.addLogger('GUILD_MEMBER_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Member updated in ${data.guild_id}: ${data.user.username}#${data.user.discriminator}`);
      }
    });
  
    this.addLogger('GUILD_ROLE_CREATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role created in ${data.guild_id}: ${data.role.name} (${data.role.id})`);
      }
    });
  
    this.addLogger('GUILD_ROLE_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role updated in ${data.guild_id}: ${data.role.name} (${data.role.id})`);
      }
    });
  
    this.addLogger('GUILD_ROLE_DELETE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role deleted in ${data.guild_id}: ${data.role_name} (${data.role_id})`);
      }
    });
  
    this.addLogger('CHANNEL_CREATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Channel created in ${data.guild_id}: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('CHANNEL_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Channel updated in ${data.guild_id}: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('CHANNEL_DELETE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Channel deleted in ${data.guild_id}: ${data.name} (${data.id})`);
      }
    });
  

  
  }

  logGuild(guildId) {
    this.addLogger('GUILD_CREATE', (data) => {
      if (data.id === guildId) {
        console.log(`Guild created: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('GUILD_UPDATE', (data) => {
      if (data.id === guildId) {
        console.log(`Guild updated: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('GUILD_DELETE', (data) => {
      if (data.id === guildId) {
        console.log(`Guild deleted: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('GUILD_MEMBER_ADD', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Member added to ${data.guild_id}: ${data.user.username}#${data.user.discriminator}`);
      }
    });
  
    this.addLogger('GUILD_MEMBER_REMOVE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Member removed from ${data.guild_id}: ${data.user.username}#${data.user.discriminator}`);
      }
    });
  
    this.addLogger('GUILD_MEMBER_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Member updated in ${data.guild_id}: ${data.user.username}#${data.user.discriminator}`);
      }
    });
  
    this.addLogger('GUILD_ROLE_CREATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role created in ${data.guild_id}: ${data.role.name} (${data.role.id})`);
      }
    });
  
    this.addLogger('GUILD_ROLE_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role updated in ${data.guild_id}: ${data.role.name} (${data.role.id})`);
      }
    });
  
    this.addLogger('GUILD_ROLE_DELETE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role deleted in ${data.guild_id}: ${data.role_name} (${data.role_id})`);
      }
    });
  
    this.addLogger('CHANNEL_CREATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Channel created in ${data.guild_id}: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('CHANNEL_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Channel updated in ${data.guild_id}: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('CHANNEL_DELETE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Channel deleted in ${data.guild_id}: ${data.name} (${data.id})`);
      }
    });
  
    this.addLogger('CHANNEL_PINS_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Channel pins updated in ${data.guild_id}: ${data.channel_id}`);
      }
    });
  
    this.addLogger('MESSAGE_CREATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Message created in ${data.guild_id}: ${data.content}`);
      }
    });
  
    this.addLogger('MESSAGE_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Message updated in ${data.guild_id}: ${data.content}`);
      }
    });
  
    this.addLogger('MESSAGE_DELETE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Message deleted in ${data.guild_id}: ${data.id}`);
      }
    });
  
    this.addLogger('MESSAGE_DELETE_BULK', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Bulk message delete in ${data.guild_id}: ${data.ids}`);
      }
    });
  
    this.addLogger('MESSAGE_REACTION_ADD', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Reaction added in ${data.guild_id}: ${data.emoji.name}`);
      }
    });
  
    this.addLogger('MESSAGE_REACTION_REMOVE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Reaction removed in ${data.guild_id}: ${data.emoji.name}`);
      }
    });
  
    this.addLogger('MESSAGE_REACTION_REMOVE_ALL', (data) => {
      if (data.guild_id === guildId) {
        console.log(`All reactions removed in ${data.guild_id}`);
      }
    });
  }

  logRole(roleId) {
    this.addLogger('GUILD_ROLE_CREATE', (data) => {
      if (data.role.id === roleId) {
        console.log(`Role created: ${data.role.name} (${data.role.id})`);
      }
    });
  
    this.addLogger('GUILD_ROLE_UPDATE', (data) => {
      if (data.role.id === roleId) {
        console.log(`Role updated: ${data.role.name} (${data.role.id})`);
      }
    });
  
    this.addLogger('GUILD_ROLE_DELETE', (data) => {
      if (data.role_id === roleId) {
        console.log(`Role deleted: ${data.role_name} (${data.role_id})`);
      }
    });
  }
  
  logRoles(guildId) {
    this.addLogger('GUILD_ROLE_CREATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role created in ${data.guild_id}: ${data.role.name} (${data.role.id})`);
      }
    });
  
    this.addLogger('GUILD_ROLE_UPDATE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role updated in ${data.guild_id}: ${data.role.name} (${data.role.id})`);
      }
    });
  
    this.addLogger('GUILD_ROLE_DELETE', (data) => {
      if (data.guild_id === guildId) {
        console.log(`Role deleted in ${data.guild_id}: ${data.role_name} (${data.role_id})`);
      }
    });
  }

  
}

module.exports = Client;
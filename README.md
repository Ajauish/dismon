<div align="center">
   <h1>Dismon.js</h1>
    A node.js library that gives you the ability to monitor Discord API gateway events.<br>
 		<a href="https://www.npmjs.com/package/dismon"> <img src="https://img.shields.io/npm/v/auth-github.svg?maxAge=3600" alt="npm version" /> </a>
		 <a href="https://www.npmjs.com/package/dismon"><img src="https://img.shields.io/npm/dt/auth-github.svg?maxAge=3600" alt="npm downloads" /></a>
</div>


## What it can do
- It can be used with discord.js
- It can log a specific discord API event
- It can log a specific role, roles, channel, or a whole guild.

## What it can't do
- You can't create a full-interactable-bot with this, you have the power to recieve and log discord API events only.

# Examples

## Connection
```javascript
const { Client } = require('dismon');

const client = new Client('TOKEN');

client.connect();
```

## Logging

###
```javascript
const { Client } = require('dismon');

const client = new Client('TOKEN');

client.connect();


// log all events on a specific channel
client.logChannel("Channel ID");

// log all events on a specific role
client.logRole("Role ID");

// log all events on all roles in a guild
client.logRoles("Guild ID")

// log a specific event
client.addLogger("READY", () => {
    console.log(`Client is ready`)
})
```

## Documents
Coming when ready

## Authors
This library is made by [Abdullah Jauish](https://jauish.com)

## Contributing
Fork, edit or pull request this library is welcomed, any modification and updates that will help Dismon will be merged.

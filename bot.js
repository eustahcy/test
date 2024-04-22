const Discord = require('discord.js');
const Database = require('better-sqlite3');
const fs = require('fs');

const klient = new Discord.Client();
klient.komendy = new Discord.Collection();

const plikiKomend = fs.readdirSync('./magazyn').filter(plik => plik.endsWith('.js'));

for (const plik of plikiKomend) {
    const komenda = require(`./magazyn/${plik}`);
    klient.komendy.set(komenda.nazwa, komenda);
}

klient.once('ready', () => {
    console.log('Bot jest gotowy!');
});

klient.login('TWÓJ_TOKEN');
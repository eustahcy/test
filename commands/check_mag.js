const Database = require('better-sqlite3');
const db = new Database('mag.db');

module.exports = {
    nazwa: '=magazyn',
    opis: 'Wyświetla zawartość magazynu.',

    execute(msg, args) {
        // Pobierz wszystkie przedmioty użytkownika z bazy danych
        const przedmioty = db.prepare('SELECT itemName, ilość FROM magazyn WHERE userId = ?')
                            .all(msg.author.id);

        if (!przedmioty || przedmioty.length === 0) {
            return msg.reply('Twój magazyn jest pusty.');
        }

        let zawartośćMagazynu = 'Zawartość twojego magazynu:\n';
        przedmioty.forEach(przedmiot => {
            zawartośćMagazynu += `${przedmiot.itemName}: ${przedmiot.ilość}\n`;
        });

        // Wyślij zawartość magazynu na czat
        return msg.channel.send(zawartośćMagazynu);
    },
};
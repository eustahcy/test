const Database = require('better-sqlite3');
const db = new Database('mag.db');

module.exports = {
    nazwa: '+cena',
    opis: 'Ustawia cenę za 1 przedmiot.',

    execute(msg, args) {
        // Sprawdź czy podano nazwę przedmiotu i cenę
        if (!args[0] || !args[1] || isNaN(args[1])) {
            return msg.reply('Użyj komendy w formacie: +cena [nazwa_przedmiotu] [cena]');
        }

        const nazwaPrzedmiotu = args[0];
        const cena = parseFloat(args[1]);

        // Sprawdź czy cena jest dodatnia
        if (cena <= 0) {
            return msg.reply('Podaj dodatnią cenę za przedmiot.');
        }

        // Sprawdź czy przedmiot istnieje w bazie danych
        const przedmiot = db.prepare('SELECT * FROM magazyn WHERE itemName = ?')
                                .get(nazwaPrzedmiotu);

        if (!przedmiot) {
            return msg.reply(`Przedmiot ${nazwaPrzedmiotu} nie istnieje w magazynie.`);
        }

        // Zaktualizuj cenę przedmiotu w bazie danych
        db.prepare('UPDATE magazyn SET cena = ? WHERE itemName = ?')
            .run(cena, nazwaPrzedmiotu);

        // Wyślij potwierdzenie
        return msg.reply(`Cena za 1 ${nazwaPrzedmiotu} została ustawiona na ${cena} zł.`);
    },
};
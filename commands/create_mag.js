const Database = require('better-sqlite3');
const fs = require('fs');

module.exports = {
    nazwa: '+create_mag',
    opis: 'Tworzy plik mag.db oraz tabelę magazyn w bazie danych.',

    execute(msg, args) {
        // Sprawdź czy plik mag.db już istnieje
        if (fs.existsSync('mag.db')) {
            return msg.reply('Plik mag.db już istnieje.');
        }

        // Utwórz nową bazę danych
        const db = new Database('mag.db');

        // Tworzenie tabeli
        db.prepare('CREATE TABLE magazyn (userId TEXT, itemName TEXT, ilość INTEGER, cena REAL)').run();

        // Zakończ
        return msg.reply('Utworzono plik mag.db oraz tabelę magazyn.');
    },
};
const Database = require('better-sqlite3');
const db = new Database('mag.db');

module.exports = {
    nazwa: '-magazyn',
    opis: 'Odejmuje ilość przedmiotów z magazynu.',

    execute(msg, args) {
        // Sprawdź czy podano nazwę przedmiotu i ilość
        if (!args[0] || !args[1] || isNaN(args[1])) {
            return msg.reply('Użyj komendy w formacie: -magazyn [nazwa_przedmiotu] [ilosc]');
        }

        const nazwaPrzedmiotu = args[0];
        const ilość = parseInt(args[1]);

        // Sprawdź czy ilość jest dodatnia
        if (ilość <= 0) {
            return msg.reply('Podaj dodatnią ilość przedmiotów.');
        }

        // Pobierz dotychczasową ilość przedmiotu z bazy danych
        const dotychczasowaIlość = db.prepare('SELECT ilość FROM magazyn WHERE userId = ? AND itemName = ?')
                                        .get(msg.author.id, nazwaPrzedmiotu);

        if (!dotychczasowaIlość || dotychczasowaIlość.ilość < ilość) {
            return msg.reply(`Nie masz wystarczającej ilości ${nazwaPrzedmiotu} w magazynie.`);
        }

        // Zaktualizuj ilość przedmiotu w bazie danych
        const nowaIlość = dotychczasowaIlość.ilość - ilość;
        db.prepare('UPDATE magazyn SET ilość = ? WHERE userId = ? AND itemName = ?')
            .run(nowaIlość, msg.author.id, nazwaPrzedmiotu);

        // Wyślij wiadomość o odjęciu przedmiotów
        return msg.reply(`Właśnie odejmujesz ${ilość} ${nazwaPrzedmiotu}. 
        Pozostało ${nowaIlość} ${nazwaPrzedmiotu} w magazynie.`);
    },
};
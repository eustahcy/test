const Database = require('better-sqlite3');
const db = new Database('mag.db');
const adminChannelId = 'ID_KANAŁU_ADMINISTRACYJNEGO'; // Zastąp ID_KANAŁU_ADMINISTRACYJNEGO właściwym ID kanału

module.exports = {
    nazwa: '+magazyn',
    opis: 'Dodaje ilość przedmiotów do magazynu.',

    execute(msg, args) {
        // Sprawdź czy podano nazwę przedmiotu i ilość
        if (!args[0] || !args[1] || isNaN(args[1])) {
            return msg.reply('Użyj komendy w formacie: +magazyn [nazwa_przedmiotu] [ilosc]');
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

        let nowaIlość;
        if (dotychczasowaIlość) {
            // Jeśli przedmiot istnieje w bazie danych, zaktualizuj ilość
            nowaIlość = dotychczasowaIlość.ilość + ilość;
            db.prepare('UPDATE magazyn SET ilość = ? WHERE userId = ? AND itemName = ?')
                .run(nowaIlość, msg.author.id, nazwaPrzedmiotu);
        } else {
            // Jeśli przedmiot nie istnieje w bazie danych, dodaj nowy wpis
            nowaIlość = ilość;
            db.prepare('INSERT INTO magazyn (userId, itemName, ilość) VALUES (?, ?, ?)')
                .run(msg.author.id, nazwaPrzedmiotu, nowaIlość);
        }

        // Sprawdź warunek dla ilości przedmiotu
        if (nowaIlość < 200) {
            const brakuje = 200 - nowaIlość;
            return msg.reply(`Do wypłacenia należności wymagane jest minimum 200 sztuk ${nazwaPrzedmiotu}. 
            Brakuje ci jeszcze ${brakuje} sztuk.`);
        } else {
            const doWypłacenia = nowaIlość - 200;
            // Wyślij wiadomość na kanał administracyjny
            const adminChannel = msg.client.channels.cache.get(adminChannelId);
            if (adminChannel) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${msg.author.tag} oddał ${doWypłacenia} ${nazwaPrzedmiotu}`)
                    .setTimestamp();
                adminChannel.send(embed);
            } else {
                console.error('Nie można znaleźć kanału administracyjnego.');
            }
            return msg.reply(`Uzupełniłeś magazyn o ${doWypłacenia} sztuk ${nazwaPrzedmiotu}. 
            Wynagrodzenie zostanie niedługo przelane na twoje konto.`);
        }
    },
};
// Viitenumeron muodostaja JavaScriptillä
// (c) Kimmo Surakka <kusti@cs.tut.fi>, 1998
// Koodia saa käyttää vapaasti muuttamattomana,
// tätä tekijänoikeusilmoitusta ei saa poistaa.
//
// Muokattu Kimmo Surakan luvalla, nyt muodostaa sarjan viitenumeroita.
// (c) Jori Mäntysalo <jori.mantysalo@uta.fi>, 2004
//
module.exports = function(companyId, invoiceId) {
    var pohja = '' + (companyId * 1000 + invoiceId);

    // tarkistetta käytetään painotetun summan laskemiseen
    var tarkiste = 0;
    //  tänne sijoitetaan lopullinen, muotoiltu merkkijono:
    var muotoiltu="";
    // Tarvittavat kertoimet löytyvät tästä:
    var kerroin = "731";
    // Käydään merkkijono läpi lopusta alkuun:
    for( var i = pohja.length - 1, j = 0, k = 1 ; i >= 0 ; i--, j++, k++) {
        // Käsiteltävä merkki:
        var merkki = pohja.charAt(i, 10);
        // Lasketaan painotettua summaa:
        tarkiste += parseInt(kerroin.charAt( j % 3 ), 10)
                    * parseInt(merkki);
        // Muotoillaan samalla tulosmerkkijonoa:
        if(k % 5 === 0) {
            muotoiltu = " " + muotoiltu;
        }
        muotoiltu = merkki + muotoiltu;
    }
    // Muodostetaan tarkistusnumero
    tarkiste = (10 - tarkiste % 10) % 10;
    // Palautetaan täydellinen viitenumero:
    return muotoiltu + tarkiste.toString();
};

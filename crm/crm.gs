var UN_MOIS = 30*24*3600*1000;
var TROIS_MOIS = UN_MOIS * 3;
var nbRelancesMax = 10;

// Configuration du module de relance.
// C'est une liste d'objects sous la forme { catégorie, à enjeu (true, false), délai avant relance }
// La catégorie est un label rattaché au contact (ici : un seul label géré = "Prospect")
// L'enjeu est déterminé par le fait d'avoir étoilé le contact dans Google Contact

// Cette configuration est à adapter selon vos besoins :
var listeGroupes = [  { 'categorie' : 'Prospect', 'enjeu' : true,  'delai' : UN_MOIS }, 
                    { 'categorie' : 'Prospect', 'enjeu' : false,  'delai' : TROIS_MOIS } ];

// Adresse à laquelle sera envoyé le mail récapitulatif
var monAdresseMail = "monadresse@monmail.com"

// Fonctionnement  :
// On parcourt les contacts. 
// Pour chaque contact :
// S'il correspond à une clé d'entrée du tableau listeGroupes, et que sa date de dernière mise à jour ou dernier mail échangé est expirée,
// Alors on ajoute ce contact dans la liste des contacts à relancer.
// La liste est transmise par mail, envoyé automatiquement.

function relanceContacts() {
  
  // On récupère tous les contacts
  var contacts = ContactsApp.getContacts();
  var compteurRelancesMax = 0
  var aujourdhui = new Date();
  
  // Pour les statistiques
  var nbContactsAnalyses = 0
  var nbMailsAnalyses = 0
  
  var libelleMailRelance = "Liste des contacts à relancer : \n"

  for (var c in contacts) {
    nbContactsAnalyses = nbContactsAnalyses + 1

    if (compteurRelancesMax<nbRelancesMax) {  
      var leContact = contacts[c]

      // On recherche la date de dernière mise à jour de fiche contact
      var derniereMiseAJour = leContact.getLastUpdated();
      var fullname = leContact.getFullName() || "Nom inconnu";
      var groups = leContact.getContactGroups();
      var premiereAdresseMail = "";
      
      var contactEnjeu = false;
      var categorieARelancer = false;
      
      
      // Ce contact correspond-il à l'un des critères de recherche ?
      for (var critere in listeGroupes) {
        // On acquiert la catégorie et l'enjeu du contact
        for (var g in groups) {
          var nomGroupe = groups[g].getName()
          switch(nomGroupe) {  
              // "Starred in Android" si à fort enjeu
            case "Starred in Android" :
              contactEnjeu = true;
              break;
            default :
              if (nomGroupe == listeGroupes[critere]['categorie'] ) categorieARelancer = true;
          }
        }
        var critereAEnjeu = listeGroupes[critere]['enjeu']

        if (categorieARelancer && (critereAEnjeu ? contactEnjeu : true)) {
          // Oui, ce contact correspond aux critères.
          // On détermine si le contact doit être relancé selon 2 critères :
          // - la date de mise à jour de la fiche contact
          // - la date du dernier mail envoyé à ce contact
          
          
          var contactArelancer = true
          
          // Mise à jour récente du contact ?
          if ( (aujourdhui.getTime() - derniereMiseAJour.getTime()) < listeGroupes[critere]['delai'] ) {
            contactArelancer = false
          } else {
            // On recherche dans les mails s'il ont été contactés
            var emails = contacts[c].getEmails();
            if (emails.length) {
              premiereAdresseMail = emails[0].getAddress()
            }
        
            for (var e in emails) {
              nbMailsAnalyses = nbMailsAnalyses + 1
              var threads = GmailApp.search('to:' + emails[e].getAddress() );  
              var dateMessageRecent = new Date('January 01, 2000');
              for (var t in threads) {
                if (threads[t].getLastMessageDate() > dateMessageRecent) {
                  dateMessageRecent = threads[t].getLastMessageDate()
                }
              }
            }
            
            if ( (aujourdhui.getTime() - dateMessageRecent.getTime() ) < listeGroupes[critere]['delai'] ) {
              contactArelancer = false
            }
          }
          
          // On ajoute si besoin ce contact à la liste des contacts à relancer
          if ( contactArelancer ) {
            libelleMailRelance = libelleMailRelance + fullname + " " + premiereAdresseMail + " - Mise à jour le " + derniereMiseAJour + ". Dernier mail le " +dateMessageRecent+  "\n"
            Logger.log(fullname + " " + premiereAdresseMail + " - Mise à jour le " + derniereMiseAJour + ". Dernier mail le " +dateMessageRecent)
            compteurRelancesMax = compteurRelancesMax +1
          }
        }
      }
    }
  }
  
  // Envoi du mail récapitulatif
  libelleMailRelance = libelleMailRelance + "\n " + nbContactsAnalyses + " contact(s) analysé(s) \n"
  libelleMailRelance = libelleMailRelance + nbMailsAnalyses + " mails(s) analysé(s) \n"
  GmailApp.sendEmail(monAdresseMail, "Liste des contacts à relancer", libelleMailRelance);
  
}

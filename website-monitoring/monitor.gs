function monitorWebsite() {
  
  var url = "https://camilab.co"; // Remplacez par l'URL du site que vous souhaitez surveiller
  var emailTo = "contact@camilab.co"; // Remplacez par votre adresse e-mail
  var subject = "Alerte : Le site est indisponible";
  var message = "Le site " + url + " est indisponible.";

  var currentDate = new Date();
  var lastSentDate = PropertiesService.getScriptProperties().getProperty("lastSentDate");

  // Si l'e-mail a déjà été envoyé aujourd'hui, ne pas réenvoyer
  if (lastSentDate !== null) {
    lastSentDate = new Date(lastSentDate);
    if (
      lastSentDate.getDate() === currentDate.getDate() &&
      lastSentDate.getMonth() === currentDate.getMonth() &&
      lastSentDate.getFullYear() === currentDate.getFullYear()
    ) {
      return;
    }
  }

  try {
    var response = UrlFetchApp.fetch(url);

    if (response.getResponseCode() !== 200) {
      // Le site est indisponible
      MailApp.sendEmail(emailTo, subject, message);
      // Enregistrer la date d'envoi
      PropertiesService.getScriptProperties().setProperty("lastSentDate", currentDate);
    }
  } catch (e) {
    // Une erreur s'est produite lors de la tentative d'accès au site
    MailApp.sendEmail(emailTo, subject, "Une erreur s'est produite : " + e.toString());
  }
}

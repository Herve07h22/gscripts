# Mes scripts

Ce dépôt comporte des exemples de scripts que j'utilise pour automatiser mon quotidien.

Les Google Scripts, plus connus sous le nom de Google Apps Script, sont une plateforme de développement intégrée à plusieurs produits Google tels que Google Sheets, Google Docs, Google Forms, Gmail, Google contact, .... 

Ils permettent de personnaliser et d'automatiser leurs workflows dans ces applications. 

Je m'en sers pour automatiser des tâches ennuyeuses et répétitives qui sont en lien avec les emails ou la gestion des contacts. 
Mais il est possible de couvrir des cas d'usages plus étendus, puisqu'on peut appeler n'importe quelle API depuis un script par le service `UrlFetchApp`.

Le script est hébergé dans le cloud, sur son compte goole. On accède à la console à cette adresse : https://script.google.com/

Dans la console, on peut définir des triggers qui vont déclencher l'exécution des scripts à une fréquence paramétrable. 
Mais il est possible aussi d'utiliser des déclencheurs événementiels, sur l'arrivée d'un mail ou renseignement d'un google form par exemple.
 
## Me rappeler les contacts à relancer

Ce script me sert de CRM.



## Surveiller un site

Ce script permet de monitorer le fonctionnement d'un site Internet.

Ca n'est jamais joyeux d'être informé par son client ou par les utisateurs qu'un site est tombé.
Ce script ping régulièrement n'importe quelle url et il notifie d'un mail lorsque le fetch retourne un status HTTP différent de 200 OK.


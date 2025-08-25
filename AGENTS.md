tu as modifié utils.ts et maintenant je n'ai plus aucune données affichées j'ai une erreur 500:

TypeError: d.getUTCFullYear is not a function
at ymKeyUTC (C:\Users\burin\OneDrive\Bureau\Digifo\.next\server\edge\chunks\[root-of-the-server]**ec144a8e.\_.js:516:21)
at fillMissingMonths (C:\Users\burin\OneDrive\Bureau\Digifo\.next\server\edge\chunks\[root-of-the-server]**ec144a8e._.js:528:21)
at <unknown> (C:\Users\burin\OneDrive\Bureau\Digifo\.next\server\edge\chunks\[root-of-the-server]\_\_ec144a8e._.js:678:164) {

}
GET /api/summary?from=&to=&accountId= 500 in 286ms

Pourquoi j'ai cette erreur ? Peux tu la corriger ?

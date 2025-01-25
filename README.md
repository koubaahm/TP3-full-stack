# Application de gestion de boutiques

Le but de ce projet est de développer un système qui permet la gestion de boutiques, de produits et de catégories associées à ces produits.

## Sommaire

1. Informations générales
2. Arborescence de l'archive
3. Technologies
4. Utilisation
5. Documentation de l'API

## Informations générales

Ce README permet de documenter le projet.

Le code source du client et celui du serveur contiennent également un README : [README du client](./shop-client/README.md), [README du serveur](./shop-server/README.md).

Le GIT du client se trouve à l'adresse https://github.com/manonguillard/shop-client et le GIT du serveur à l'adresse https://github.com/manonguillard/shop-server.

## Arborescence de l'archive

L'archive contient les fichiers et répertoires suivants :

- le fichier [CR-projet-FS.pdf](./CR-projet-FS.pdf) : le compte rendu du projet
- Le fichier [README.md](./README.md) : le fichier de documentation du projet
- Le répertoire [/shop-client](./shop-client/) : le code source du client
- Le répertoire [/shop-server](./shop-server/) : le code source du serveur
- Le fichier [docker-compose.yml](./docker-compose.yml) : le fichier docker-compose qui permet de lancer la configuration docker du projet

## Technologies

Voici la liste des technologies utilisées dans le projet :

- React pour le front-end
- Spring Boot pour le back-end
- PostgreSQL pour la base de données

Pour la base de données, j'ai fait le choix d'utiliser PostgreSQL. En effet, je voulais utiliser une base de données SQL car les relations entre les données dans ce projet sont importantes et que les schémas des données sont stables. Mon choix s'est alors porté sur PostgreSQL car ce SGBD est performant et propose de nombreux types comme timezone-aware timestamps ou ranges que MySQL ne propose pas. Ces types pourront être utiles pour d'éventuelles évolutions du projet.

## Utilisation

Le projet est entièrement dockerisé. Il suffit d'ouvrir un terminal à la racine de l'archive et d'exécuter la commande `docker compose up`.

Le front-end de l'application se trouve ensuite à l'adresse http://localhost:4200 et le back-end à l'adresse http://localhost:8080.

## Documentation de l'API

Une [documentation swagger](http://localhost:8080/swagger-ui/#/shop-controller) de l'API est disponible.

## Elasticsearch

Une connexion à Elasticsearch via hibernate search est effectué
Pour accéder aux données présente dans elasticsearch vous pouvez utiliser Kibana par exemple avec l'exemple suivant :

docker run --net tp3_postgres -p 5601:5601 docker.elastic.co/kibana/kibana:7.17.25

Ensuite aller sur l'URL http://localhost:5601/app/dev_tools#/console

Par défaut hibernate search créer les index avec comme modèle idx_NomDeLEntité-000001
Donc pour accéder aux données des boutiques présente dans Elasticsearch, vous pouvez faire la requête suivante : 

```
GET idx_shops-000001/_search
{
  "query": {
    "match_all": {}
  }
}
```


## Troubleshooting

Parfois, au démarrage du docker compose le serveur s'éteind, si ce cas arrive vous pouvez relancer le serveur avec docker compose up -d

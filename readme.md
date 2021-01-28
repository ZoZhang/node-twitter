# Twitter
C'est un simulateur Twitter base sur le projet [Node Twitter](https://github.com/vinitkumar/node-twitter)

## Pré-requis
Vous devez installer Node.js et MongoDB si vous souhaitez exécuter l'application localement.

- [Node.js](http://nodejs.org)
- [Mongodb](http://docs.mongodb.org/manual/installation/)

Installez aussi sass et grunt pour compiler les fichiers CSS
```
sudo npm install -g grunt-cli
sudo npm install -g sass
```
## Configuration
La configuration est dans `config/config.js`.
Veuillez créer votre propre fichier `.env`. 
Vous pouvez trouver un exemple de fichier `.env` dans` .env.example`.

## Utilisation

```sh
# Après demaré le server mongodb
# Vous installez touts les dépendances

npm install

# Lorsque l'installation termine, vous pouvez lancer l'application avec la commande suivante.

npm start

# Et après, vous pouvez consulter l'adresse dans le navigateur 

http://localhost:3000/
```

## Changement fonctionnalité && styles
* [x] S'inscription/S'authentification d'un compte local
* [x] Ajoute Unfollow && Utilisateur recommandé && Avatar Image 
* [x] Mise à jour profile d'utilisateur && RGPD
* [x] Mise à jour Chat、Tweet、Commentaire Style etc.

## Démonstration
### Page d'authentification
![](https://i.imgur.com/KksQ7qj.jpg)

### Page d'accueil
![](https://i.imgur.com/PqzOu0s.jpg)

### Profile d'utilisateur authentifié
![](https://i.imgur.com/fS9kmbK.jpg)

### Page Following
![](https://i.imgur.com/lc1AOHF.jpg)

### Profile d'autre utilisateur
![](https://i.imgur.com/Prjhx6V.jpg)

### Page chat
![](https://i.imgur.com/ZL7MMid.jpg)

![](https://i.imgur.com/D0tmyhx.jpg)

### Commentaire modal
![](https://i.imgur.com/OhpdyuU.jpg)

### Nouveau Tweet modal
![](https://i.imgur.com/mtQfJcI.jpg)

## License
[Apache License 2.0](https://github.com/vinitkumar/node-twitter/blob/master/License)


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvinitkumar%2Fnode-twitter.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvinitkumar%2Fnode-twitter?ref=badge_large)

## Important

Twitter is a registered trademark of Twitter Inc. This project is just for learning purposes and should be treated as such.

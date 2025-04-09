# ProjetWEB3

## À propos
Une application décentralisée (DApp) permettant d'interagir avec la blockchain Ethereum. Ce projet démontre l'utilisation de contrats intelligents pour stocker et gérer des données sur la blockchain.

## Fonctionnalités

### Contrats intelligents
- **StringRegistry** : Un registre qui permet d'ajouter des chaînes de caractères et des hachages de fichiers sur la blockchain

### Capacités
- Stockage de chaînes de caractères sur la blockchain
- Calcul et stockage des hachages de fichiers
- Verrouillage de fonds avec libération temporisée

## Technologies utilisées
- Solidity ^0.8.0
- Hardhat
- Hardhat Ignition pour les déploiements
- Ethers.js
- Chai pour les tests

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/jujedie/ProjetWEB3.git
cd ProjetWEB3

# Installer les dépendances
npm install
```

## Lancement

```bash
npx hardhat node
```

## Tests

```bash
# Lancer les tests
npx hardhat test
```

## Déploiement

```bash
# Déployer sur un réseau de test
npx hardhat ignition deploy ./ignition/modules/StringRegistry.js --network localhost
```

## Utilisation
Interactions possibles avec les contrats :
- Ajouter une chaîne de caractères au registre
- Récupérer toutes les chaînes stockées
- Ajouter le hachage d'un fichier

## Licence
Ce projet est sous licence MIT.

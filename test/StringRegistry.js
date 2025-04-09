const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("RegistreDeChaînes", function () {
  // Fixture pour déployer le contrat StringRegistry
  async function déployerRegistreDeChaînesFixture() {
    // Obtenir les signataires
    const [propriétaire, autreCompte] = await ethers.getSigners();

    // Déployer le contrat StringRegistry
    const RegistreDeChaînes = await ethers.getContractFactory("StringRegistry");
    const registreDeChaînes = await RegistreDeChaînes.deploy();

    return { registreDeChaînes, propriétaire, autreCompte };
  }

  describe("Déploiement", function () {
    it("Devrait se déployer avec succès", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      // Vérification simple pour confirmer que le contrat a été déployé
      expect(await registreDeChaînes.getAddress()).to.be.properAddress;
    });

    it("Devrait commencer avec un tableau de chaînes vide", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      expect(await registreDeChaînes.getStrings()).to.deep.equal([]);
    });
  });

  describe("Ajout de chaînes", function () {
    it("Devrait ajouter une chaîne au registre", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      
      const chaîneDeTest = "Bonjour, monde !";
      await registreDeChaînes.addString(chaîneDeTest);
      
      const chaînesStockées = await registreDeChaînes.getStrings();
      expect(chaînesStockées.length).to.equal(1);
      expect(chaînesStockées[0]).to.equal(chaîneDeTest);
    });

    it("Devrait ajouter plusieurs chaînes au registre", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      
      const chaînesDeTest = ["Chaîne 1", "Chaîne 2", "Chaîne 3"];
      
      for (const str of chaînesDeTest) {
        await registreDeChaînes.addString(str);
      }
      
      const chaînesStockées = await registreDeChaînes.getStrings();
      expect(chaînesStockées.length).to.equal(chaînesDeTest.length);
      
      for (let i = 0; i < chaînesDeTest.length; i++) {
        expect(chaînesStockées[i]).to.equal(chaînesDeTest[i]);
      }
    });

    it("Devrait permettre à différents comptes d'ajouter des chaînes", async function () {
      const { registreDeChaînes, autreCompte } = await loadFixture(
        déployerRegistreDeChaînesFixture
      );
      
      await registreDeChaînes.addString("Ajouté par le propriétaire");
      await registreDeChaînes.connect(autreCompte).addString("Ajouté par un autre compte");
      
      const chaînesStockées = await registreDeChaînes.getStrings();
      expect(chaînesStockées.length).to.equal(2);
      expect(chaînesStockées[0]).to.equal("Ajouté par le propriétaire");
      expect(chaînesStockées[1]).to.equal("Ajouté par un autre compte");
    });
  });

  describe("Suppression de chaînes", function () {
    it("Devrait supprimer une chaîne du registre", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      
      const chaîneDeTest = "À supprimer";
      await registreDeChaînes.addString(chaîneDeTest);
      
      const chaînesAvantSuppression = await registreDeChaînes.getStrings();
      expect(chaînesAvantSuppression.length).to.equal(1);
      
      await registreDeChaînes.removeString(chaînesAvantSuppression.length - 1);
      
      const chaînesAprèsSuppression = await registreDeChaînes.getStrings();
      expect(chaînesAprèsSuppression.length).to.equal(0);
    });

    it("Devrait supprimer plusieurs chaînes du registre", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      const chaînesDeTest = ["À supprimer 1", "À supprimer 2", "À supprimer 3"];
      for (const str of chaînesDeTest) {
        await registreDeChaînes.addString(str);
      }
      const chaînesAvantSuppression = await registreDeChaînes.getStrings();
      expect(chaînesAvantSuppression.length).to.equal(3);
      // Suppression de toutes les chaînes
      for (let i = chaînesAvantSuppression.length - 1; i >= 0; i--) {
        await registreDeChaînes.removeString(i);
      }
      const chaînesAprèsSuppression = await registreDeChaînes.getStrings();
      expect(chaînesAprèsSuppression.length).to.equal(0);
    });

    it("Devrait ne pas permettre de supprimer une chaîne inexistante", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      const chaîneDeTest = "À supprimer";
      await registreDeChaînes.addString(chaîneDeTest);
      const chaînesAvantSuppression = await registreDeChaînes.getStrings();
      expect(chaînesAvantSuppression.length).to.equal(1);
      // Suppression de la chaîne
      await registreDeChaînes.removeString(0);
      const chaînesAprèsSuppression = await registreDeChaînes.getStrings();
      expect(chaînesAprèsSuppression.length).to.equal(0);
      // Tentative de suppression d'une chaîne inexistante
      await expect(registreDeChaînes.removeString(0)).to.be.revertedWith("Index hors limites");
    });

    it("Devrait ne pas permettre de supprimer une chaîne avec un index négatif", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      const chaîneDeTest = "À supprimer";
      await registreDeChaînes.addString(chaîneDeTest);
      const chaînesAvantSuppression = await registreDeChaînes.getStrings();
      expect(chaînesAvantSuppression.length).to.equal(1);
      // Tentative de suppression avec un index négatif
      await expect(registreDeChaînes.removeString(-1)).to.be.revertedWith("Index hors limites");
    });

    it("Devrait ne pas permettre de supprimer une chaîne avec un index supérieur à la longueur du tableau", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      const chaîneDeTest = "À supprimer";
      await registreDeChaînes.addString(chaîneDeTest);
      const chaînesAvantSuppression = await registreDeChaînes.getStrings();
      expect(chaînesAvantSuppression.length).to.equal(1);
      // Tentative de suppression avec un index supérieur à la longueur du tableau
      await expect(registreDeChaînes.removeString(chaînesAvantSuppression.length)).to.be.revertedWith("Index hors limites");
    });
  });

  describe("Récupération des chaînes", function () {
    it("Devrait retourner toutes les chaînes ajoutées dans l'ordre", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      
      const chaînesDeTest = ["Première", "Deuxième", "Troisième"];
      
      for (const str of chaînesDeTest) {
        await registreDeChaînes.addString(str);
      }
      
      const chaînesStockées = await registreDeChaînes.getStrings();
      expect(chaînesStockées).to.deep.equal(chaînesDeTest);
    });
  });


  describe("Hachage de fichiers", function () {
    it("Devrait ajouter un hash de fichier sans erreur", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      
      const cheminDeFichier = "/chemin/vers/fichier.txt";
      // Vérifie que l'appel à hashFile ne génère pas d'erreur
      await expect(registreDeChaînes.hashFile(cheminDeFichier)).not.to.be.reverted;
    });

    it("Devrait pouvoir ajouter plusieurs hashes de fichiers", async function () {
      const { registreDeChaînes } = await loadFixture(déployerRegistreDeChaînesFixture);
      
      const cheminsDeFichiers = [
        "/chemin/vers/fichier1.txt",
        "/chemin/vers/fichier2.txt",
        "/chemin/vers/fichier3.txt"
      ];
      
      // Ajouter plusieurs hashes de fichiers
      for (const chemin of cheminsDeFichiers) {
        await expect(registreDeChaînes.hashFile(chemin)).not.to.be.reverted;
      }
    });

    it("Devrait permettre à différents comptes d'ajouter des hashes", async function () {
      const { registreDeChaînes, autreCompte } = await loadFixture(
        déployerRegistreDeChaînesFixture
      );
      
      await expect(registreDeChaînes.hashFile("/fichier-du-proprietaire.txt")).not.to.be.reverted;
      await expect(registreDeChaînes.connect(autreCompte).hashFile("/fichier-autre-compte.txt")).not.to.be.reverted;
    });
  });
});
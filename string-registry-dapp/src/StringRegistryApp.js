import React from 'react';
import Web3 from 'web3';
import StringRegistry  from './StringRegistry.json';

function StringRegistryApp(){
    const [account, setAccount] = React.useState(null);
    const [contract, setContract] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function initWeb3() {
            if (window.ethereum) {
                try {
                    const web3 = new Web3(window.ethereum);

                    // Récupération du compte crypto
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);

                    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
                    const stringRegistry = new web3.eth.Contract(StringRegistry.abi, contractAddress);
                    setContract(stringRegistry);

                    console.log("Contrat initialisé :", stringRegistry);
                } catch (error) {
                    setError('Impossible de récupérer le compte. Vérifiez votre portefeuille.');
                    console.error(error);
                }
            } else {
                console.error("Metamask not detected");
            }
        }
        initWeb3();
    }, []);

    return (
        <div id='bodyApp'>
            <h1>String Register DApp</h1>

            <div>
              <input type="text" id="stringInput" placeholder="Entrez une chaîne de caractères" />
              <button id="addStringButton" onClick={() => addString({account, contract})}>Ajouter une chaîne</button>
            </div>

            <div id="liste des chaînes">
                <h2>Liste des chaînes<button id="refreshButton" onClick={() => updateString({contract, account})}>Rafraîchir</button></h2>
                
                <ul id="stringList">
                    {/* Les chaînes seront affichées ici */}
                </ul>
            </div>

            

            <div>
                <h2>Hasher un fichier </h2>
                <button id="checkHashButton" onClick={() => addFileHash({ contract, account })}>Ajouter le hash d'un fichier</button>

                <h2>Vérification du hash d'un fichier</h2>
                <button id="checkHashButton" onClick={() => checkFileHash({ contract })}>Vérifier l'éxistance du hash d'un fichier</button>
            </div>
        </div>
    );
}

async function addString({account, contract}) {
    const stringInput = document.getElementById("stringInput").value;
    if (!stringInput) {
        alert("Veuillez entrer une chaîne de caractères.");
        return;
    }

    try {
        await contract.methods.addString(stringInput).send({ from: account });
        alert("Chaîne ajoutée avec succès !");
        updateString({contract, account});
    } catch (error) {
        console.error("Erreur lors de l'ajout de la chaîne :", error);
        alert("Erreur lors de l'ajout de la chaîne. Vérifiez la console pour plus d'informations.");
    }
}

async function updateString({contract, account}) {
    const stringList = document.getElementById("stringList");
    stringList.innerHTML = ""; // Clear the list before updating

    try {
        const strings = await contract.methods.getStrings().call();
        strings.forEach((str, index) => {
            const li = document.createElement("li");
            const p = document.createElement("p");
            const btn = document.createElement("button");
            btn.textContent = "Supprimer";
            btn.onclick =  () => removeString({contract, account, index});

            p.textContent = str;
            
            li.appendChild(p);
            li.appendChild(btn);

            li.id = index;
            stringList.appendChild(li);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des chaînes :", error);
        alert("Erreur lors de la récupération des chaînes. Vérifiez la console pour plus d'informations.");
    }
}

async function removeString({contract, account, index}) {
    try {
        await contract.methods.removeString(index).send({ from: account });
        alert("Chaîne supprimée avec succès !");
        updateString({contract, account});
    } catch (error) {
        console.error("Erreur lors de la suppression de la chaîne :", error);
        alert("Erreur lors de la suppression de la chaîne. Vérifiez la console pour plus d'informations.");
    }
}

async function checkFileHash({ contract }) {
  const filePath = prompt("Entrez le chemin du fichier pour vérifier son hash :");
  if (!filePath) {
      alert("Veuillez entrer un chemin de fichier.");
      return;
  }

  try {
      const isPresent = await contract.methods.isHashPresent(filePath).call();
      if (isPresent) {
          alert("Le hash de ce fichier est bien présent dans la blockchain.");
      } else {
          alert("Le hash de ce fichier n'est pas présent dans la blockchain.");
      }
  } catch (error) {
      console.error("Erreur lors de la vérification du hash :", error);
      alert("Erreur lors de la vérification du hash. Vérifiez la console pour plus d'informations.");
  }
}

async function addFileHash({ contract, account }) {
  const filePath = prompt("Entrez le chemin du fichier pour ajouter son hash :");
  if (!filePath) {
      alert("Veuillez entrer un chemin de fichier.");
      return;
  }

  try {
      await contract.methods.hashFile(filePath).send({ from: account });
      alert("Hash de fichier ajouté avec succès !");
  } catch (error) {
      console.error("Erreur lors de l'ajout du hash :", error);
      alert("Erreur lors de l'ajout du hash. Vérifiez la console pour plus d'informations.");
  }
}

export default StringRegistryApp;
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

                    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
                <h2>Liste des chaînes</h2>
                <button id="refreshButton" onClick={() => updateString({contract})}>Rafraîchir</button>
                <ul id="stringList">
                    {/* La liste des chaînes sera affichée ici */}
                </ul>
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
    } catch (error) {
        console.error("Erreur lors de l'ajout de la chaîne :", error);
        alert("Erreur lors de l'ajout de la chaîne. Vérifiez la console pour plus d'informations.");
    }
}

async function updateString({contract}) {
    const stringList = document.getElementById("stringList");
    stringList.innerHTML = ""; // Clear the list before updating

    try {
        const strings = await contract.methods.getStrings().call();
        strings.forEach((str, index) => {
            const li = document.createElement("li");
            li.textContent = str;
            li.id = index;
            stringList.appendChild(li);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des chaînes :", error);
        alert("Erreur lors de la récupération des chaînes. Vérifiez la console pour plus d'informations.");
    }
}

export default StringRegistryApp;
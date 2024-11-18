// Fonction pour charger les langues depuis le fichier JSON
function loadLanguages() {
    fetch('langues.json')
        .then(response => response.json())
        .then(data => {
            const sourceLangSelect = document.getElementById('source_lang');
            const targetLangSelect = document.getElementById('target_lang');

            // Remplir les sélecteurs avec les langues
            data.languages.forEach(lang => {
                const optionSource = document.createElement('option');
                optionSource.value = lang.code;
                optionSource.textContent = lang.name;

                const optionTarget = document.createElement('option');
                optionTarget.value = lang.code;
                optionTarget.textContent = lang.name;

                sourceLangSelect.appendChild(optionSource);
                targetLangSelect.appendChild(optionTarget);
            });

            // Définir la langue source par défaut comme étant l'anglais
            sourceLangSelect.value = 'en';
        })
        .catch(error => console.error('Error loading languages:', error));
}

// Appeler la fonction pour charger les langues au démarrage
window.onload = loadLanguages;

function translateText() {
    const text = encodeURIComponent(document.getElementById('text').value.trim()); // Supprimer les espaces inutiles
    const sourceLang = document.getElementById('source_lang').value;
    const targetLang = document.getElementById('target_lang').value;

    // Vérification si les langues et le texte sont valides
    if (!sourceLang || !targetLang) {
        alert('Please select both source and target languages.');
        return; // Arrêter la fonction si une langue n'est pas sélectionnée
    }

    if (!text) {
        alert('Please enter the text to translate.');
        return; // Arrêter la fonction si aucun texte n'est entré
    }

    // URL de l'API de traduction
    const apiUrl = `https://655.mtis.workers.dev/translate?text=${text}&source_lang=${sourceLang}&target_lang=${targetLang}`;
    
    // Utilisation de AllOrigins pour contourner CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
            // Vérifier si la réponse contient la traduction
            const translationData = JSON.parse(data.contents);
            const translatedText = translationData.response.translated_text;
            document.getElementById('result').innerText = translatedText;
        })
        .catch(error => {
            console.error('Error during translation:', error);
            document.getElementById('result').innerText = "An error occurred during translation.";
        });
}

function copyText() {
    const resultText = document.getElementById('result').innerText; // Récupère le texte du résultat
    if (resultText) {
        // Crée un champ de texte temporaire
        const textArea = document.createElement('textarea');
        textArea.value = resultText;
        document.body.appendChild(textArea);
        textArea.select(); // Sélectionne le texte
        document.execCommand('copy'); // Copie le texte dans le presse-papiers
        document.body.removeChild(textArea); // Supprime le champ de texte temporaire

        // Optionnel : Afficher une notification de copie réussie
        alert('Text copied to clipboard!');
    } else {
        alert('There is no text to copy!');
    }
}

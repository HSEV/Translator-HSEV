document.addEventListener("DOMContentLoaded", function() {
    const translateButton = document.getElementById('translateBtn');
    const copyButton = document.getElementById('copy-btn');

    // Ajout d'événements pour les boutons
    translateButton.addEventListener('click', translateText);
    copyButton.addEventListener('click', copyText);

    // Charger les langues depuis le fichier JSON
    loadLanguages();
    // Restaurer la langue sélectionnée à partir de localStorage
    restoreLanguageSelection();
});

// Fonction pour charger les langues depuis le fichier JSON
function loadLanguages() {
    // Chargement du fichier JSON
    fetch('langues.json')
        .then(response => response.json())
        .then(data => {
            const languages = data.languages; // Récupérer la liste des langues depuis le fichier JSON

            const sourceLangSelect = document.getElementById('source_lang');
            const targetLangSelect = document.getElementById('target_lang');

            // Vider les listes avant de les remplir
            sourceLangSelect.innerHTML = '';
            targetLangSelect.innerHTML = '<option value="" disabled selected>Select your language</option>'; // Option par défaut

            // Ajouter les options de langue au select source et target
            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;  // code de la langue
                option.textContent = lang.name;  // Nom de la langue
                sourceLangSelect.appendChild(option);

                // Ajouter également aux deux sélecteurs
                const optionClone = option.cloneNode(true); // Cloner pour le target
                targetLangSelect.appendChild(optionClone);

                // Définir l'anglais comme langue par défaut (si disponible)
                if (lang.code === 'en') { // Vérifie si le code de langue est 'en' pour l'anglais
                    sourceLangSelect.value = lang.code;
                }
            });
        })
        .catch(error => {
            console.error('Error loading languages:', error);
        });
}

// Fonction pour restaurer la langue sélectionnée à partir des cookies
function restoreLanguageSelection() {
    const savedSourceLang = getCookie('sourceLang');
    const savedTargetLang = getCookie('targetLang');

    // Charger les langues depuis le fichier JSON pour vérifier les abréviations
    fetch('langues.json')
        .then(response => response.json())
        .then(data => {
            const languages = data.languages;

            // Si une langue source est sauvegardée, on vérifie son code
            if (savedSourceLang) {
                const sourceLang = languages.find(lang => lang.code === savedSourceLang);
                if (sourceLang) {
                    document.getElementById('source_lang').value = sourceLang.code;
                }
            }

            // Si une langue cible est sauvegardée, on vérifie son code
            if (savedTargetLang) {
                const targetLang = languages.find(lang => lang.code === savedTargetLang);
                if (targetLang) {
                    document.getElementById('target_lang').value = targetLang.code;
                }
            }
        })
        .catch(error => {
            console.error('Error restoring languages:', error);
        });
}


// Fonction pour définir un cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Durée du cookie
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}


// Fonction pour lire un cookie
function getCookie(name) {
    const cname = name + "=";
    const decodedCookies = decodeURIComponent(document.cookie);
    const ca = decodedCookies.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}
// Sauvegarde de la langue choisie
function saveLanguageSelection() {
    const sourceLang = document.getElementById('source_lang').value;
    const targetLang = document.getElementById('target_lang').value;
    
    if (sourceLang) {
        setCookie('sourceLang', sourceLang, 365);  // Sauvegarde dans un cookie
    }
    if (targetLang) {
        setCookie('targetLang', targetLang, 365);  // Sauvegarde dans un cookie
    }
}



// Fonction de traduction
function translateText() {
    const text = encodeURIComponent(document.getElementById('text').value);
    const sourceLang = document.getElementById('source_lang').value;
    const targetLang = document.getElementById('target_lang').value;
    
    if (!sourceLang || !targetLang) {
        alert('Please select both source and target languages.');
        return;
    }

    if (!text) {
        alert('Please enter text to translate.');
        return;  // Arrête l'exécution si le champ de texte est vide
    }

    // Sauvegarder la langue dans les cookies
    saveLanguageSelection();  // Enregistrer la sélection dans les cookies

    // URL de l'API de traduction
    const apiUrl = `https://655.mtis.workers.dev/translate?text=${text}&source_lang=${sourceLang}&target_lang=${targetLang}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
            const translatedText = data.response.translated_text;

            // Afficher le texte traduit dans le conteneur de résultats
            const resultContainer = document.getElementById('result');
            resultContainer.innerText = translatedText;

            // Augmenter la hauteur du body et html de 150px
            document.documentElement.style.height = `calc(100% + 150px)`; // Modifie la hauteur de l'élément HTML
            document.body.style.height = `calc(100% + 150px)`; // Modifie la hauteur du body
        })
        .catch(error => {
            console.error('Error during translation:', error);
        });
}


// Fonction pour copier le texte traduit
function copyText() {
    const resultText = document.getElementById('result').innerText;
    if (resultText) {
        navigator.clipboard.writeText(resultText).then(() => {
            alert('Text copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text:', err);
        });
    } else {
        alert('No text to copy');
    }
}

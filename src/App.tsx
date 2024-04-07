import  { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import './style.css';

const API = "https://node-hangman-api-production.up.railway.app/";

function App() {
  const [wordToGuess, setWordToGuess] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [isLoser, setIsLoser] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [locale, setLocale] = useState<string>(() => {
    // Charger la langue depuis le local storage ou utiliser la langue par défaut
    return localStorage.getItem('hangmanLocale') || "fr-FR";
  });
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");

 
  const addGuessedLetter = useCallback(async (letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return;

    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isLoser, isWinner]);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const formData = new URLSearchParams();
        formData.append("locale", locale);

        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        const data = await res.json();
        setWordToGuess(data.word);
      } catch (error) {
        console.error('Error during API request:', error);
      }
    };

    fetchWord();
  }, [locale]);

  useEffect(() => {
    const incorrectLetters = guessedLetters.filter(
      letter => !wordToGuess.includes(letter)
    );

    const isLoser = incorrectLetters.length >= 6;
    const isWinner = wordToGuess.split("").every(letter =>
      guessedLetters.includes(letter)
    );

    setIsLoser(isLoser);
    setIsWinner(isWinner);

    if (isWinner) {
      const winMessage = locale === "fr-FR" ? "🕊️longue vie!" : "🕊️You Win!";
      setPopupMessage(winMessage);
      setShowPopup(true);
    }
  
    if (isLoser) {
      const loseMessage = locale === "fr-FR" ? "🪦 Dommage... !" : "🪦 Oops... You Lose!";
      setPopupMessage(loseMessage);
      setShowPopup(true);
    }
  }, [guessedLetters, wordToGuess]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isFrench = locale === "fr-FR";
  
      // Check if the key is a lowercase letter in the English alphabet
      const isEnglishLetter = key.match(/^[a-z]$/);
  
      // Check if the key is a lowercase accented letter in the French alphabet
      const isFrenchLetter = isFrench && key.match(/^[a-zè-]$/);
  
      // Determine whether the key is valid based on the language and game state
      const isValidKey = isEnglishLetter || isFrenchLetter;
  
      // Return early if the key is not valid or if the game is over
      if (!isValidKey || isLoser || isWinner || guessedLetters.includes(key)) return;
  
      // Add the guessed letter
      addGuessedLetter(key);
    },
    [addGuessedLetter, guessedLetters, isLoser, isWinner, locale]
  );
  
  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

  const changeLocale = (newLocale: string) => {
    // Mettre à jour la langue dans le state et le local storage
    setLocale(newLocale);
    localStorage.setItem('hangmanLocale', newLocale);
    // setWordToGuess("");
    window.location.reload(); // Recharger la page après le changement de langue
  };

  
  
  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem('hangmanLocale', locale); // Stockez la locale actuelle dans le stockage local
    window.location.reload();

 
  };

  return (
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      margin: "0 auto",
      alignItems: "center"
    }}>
      {locale === "fr-FR" ? (
      <h1>Le Pendu.</h1>
    ) : (
      <h1>The Hangman.</h1>
    )}
      <HangmanDrawing numberOfGuesses={guessedLetters.filter(letter => !wordToGuess.includes(letter)).length} />
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={guessedLetters.filter(letter =>
            !wordToGuess.includes(letter)
          )}
          addGuessedLetter={addGuessedLetter}
          locale={locale} // Passer le locale comme prop
        />
      </div>
      {showPopup && (isLoser || isWinner) && (
        <div style={{
          position:"fixed",
          top:"50%",
          left:"50%",
          transform:"translate(-50%, -50%)",
          backgroundColor:"#EDE7B1",
          padding:"1.5rem 2rem",
          border:"solid #3a3a3a 3px",
        }} className="popup-modal">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button className="start" style={{
              textTransform:"uppercase",
              fontFamily: "'akira', sans-serif",
              fontWeight: "400"
            }}  onClick={closePopup}>
        {locale === "fr-FR" ? "Recommencer ?" : "start over?"}
      </button>          </div>
        </div>
      )}
      <div style={{
        display: "flex",
        position: "absolute",
        right: "0",
        margin: "1rem 1rem 0",
        fontSize: "1.5rem"
      }}>
        <button  className="langue" style={{
          marginRight: "1rem",
          fontSize: "2rem",
          width: "50%",
          backgroundColor: locale === "fr-FR" ? "#EDE7B1" : "transparent", 
          textDecoration: locale === "fr-FR" ? "underline" : "none", 
          

        }} onClick={() => changeLocale("fr-FR")}>fr</button>
        <button className="langue" style={{
          fontSize: "2rem",
          width: "50%",
          backgroundColor: locale === "en-GB" ? "#EDE7B1" : "transparent", 
          textDecoration: locale === "en-GB" ? "underline" : "none", 

        }} onClick={() => changeLocale("en-GB")}>en</button>
      </div>
      <a href="https://mariafolio.fr/" target='_blank' rel="noopener noreferrer">
        <h2>by Maria Ouedraogo💫</h2>
      </a>
    </div>
  );
  
}

export default App;


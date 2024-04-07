import styles from "./Keyboard.module.css";

// Définir un type pour KEYS
interface Keys {
  [key: string]: string[];
}

const KEYS: Keys = {
  "fr-FR": [
    "a",
    "b",
    "c",
    "d",
    "e",
    "è",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "-"
  ],
  "en-GB": [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
};

type KeyboardProps = {
  disabled?: boolean;
  activeLetters: string[];
  inactiveLetters: string[];
  addGuessedLetter: (letter: string) => void;
  locale: string;
};

export function Keyboard({
  activeLetters,
  inactiveLetters,
  addGuessedLetter,
  disabled = false,
  locale = "en-GB",
}: KeyboardProps) {
  // Utilisation du locale pour obtenir les clés appropriées
  const keys = KEYS[locale as keyof Keys] || KEYS["en-GB"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))",
        gap: ".2rem",
      }}
    >
      {keys.map((key: string, index: number) => {
        const isActive = activeLetters.includes(key);
        const isInactive = inactiveLetters.includes(key);
        return (
          <button
            onClick={() => addGuessedLetter(key)}
            className={`${styles.btn} ${
              isActive ? styles.active : ""
            } ${isInactive ? styles.inactive : ""} letters`}
            disabled={isInactive || isActive || disabled}
            key={index}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}

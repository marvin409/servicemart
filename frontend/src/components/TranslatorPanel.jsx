import { useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "sw", label: "Kiswahili" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" }
];

function TranslatorPanel({ language }) {
  const [sourceLanguage, setSourceLanguage] = useState(language || "en");
  const [targetLanguage, setTargetLanguage] = useState("fr");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [status, setStatus] = useState("");

  async function translateText(event) {
    event.preventDefault();
    const query = sourceText.trim();
    if (!query) {
      setStatus("Enter a message to translate.");
      return;
    }

    setStatus("Translating...");
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${sourceLanguage}|${targetLanguage}`;
      const response = await fetch(url);
      const payload = await response.json();
      const nextText = payload?.responseData?.translatedText || "";
      setTranslatedText(nextText);
      setStatus(nextText ? "Translation ready." : "No translation was returned.");
    } catch (error) {
      setStatus("Translation failed. Try again in a moment.");
    }
  }

  return (
    <section className="translator-panel">
      <div className="translator-copy">
        <p className="eyebrow">Global Translator</p>
        <h2>Help workers and employers understand each other instantly.</h2>
        <p>
          Translate job messages, hiring notes, and role expectations across countries before you apply or hire.
        </p>
      </div>

      <form className="translator-form" onSubmit={translateText}>
        <div className="translator-controls">
          <label>
            <span>From</span>
            <select value={sourceLanguage} onChange={(event) => setSourceLanguage(event.target.value)}>
              {languages.map((item) => (
                <option key={item.code} value={item.code}>{item.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>To</span>
            <select value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)}>
              {languages.map((item) => (
                <option key={item.code} value={item.code}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="translator-grid">
          <textarea
            rows="4"
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
            placeholder="Paste a message from a worker or employer"
          />
          <textarea rows="4" value={translatedText} readOnly placeholder="Translation will appear here" />
        </div>

        <div className="translator-actions">
          <button type="submit" className="button primary">Translate</button>
          <span className="translator-status">{status}</span>
        </div>
      </form>
    </section>
  );
}

export default TranslatorPanel;

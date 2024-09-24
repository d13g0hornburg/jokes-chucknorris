import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [joke, setJoke] = useState('');           // Estado para a piada original
  const [translatedJoke, setTranslatedJoke] = useState(''); // Estado para a piada traduzida

  // Função para carregar uma piada aleatória
  const loadJoke = () => {
    fetch('https://api.chucknorris.io/jokes/random')
      .then((response) => response.json())
      .then((data) => {
        setJoke(data.value); // Atualiza a piada original
        translateJoke(data.value); // Traduz a piada para português
      });
  };

  // Função para traduzir a piada usando a API LibreTranslate
  const translateJoke = (text) => {
    fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,          // Piada a ser traduzida
        source: 'en',      // Idioma de origem (inglês)
        target: 'pt',      // Idioma de destino (português)
        format: 'text',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTranslatedJoke(data.translatedText); // Atualiza o estado com a piada traduzida
      });
  };

  // Carrega uma piada ao iniciar
  useEffect(() => {
    loadJoke();
  }, []);

  return (
    <div className="container">
      <header>
        <strong>Piadas do Chuck Norris</strong>
      </header>
      <div className="joke-box">
        <p><strong>Original:</strong> {joke ? joke : 'Carregando piada...'}</p>
        <p><strong>Traduzida:</strong> {translatedJoke ? translatedJoke : 'Carregando tradução...'}</p>
      </div>
      <button onClick={loadJoke} className="joke-button">Outra piada</button>
    </div>
  );
}

export default App;
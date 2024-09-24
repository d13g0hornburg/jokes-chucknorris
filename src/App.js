import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

function App() {
  const [joke, setJoke] = useState('');           // Estado para a piada original
  const [translatedJoke, setTranslatedJoke] = useState(''); // Estado para a piada traduzida

  // Função para carregar uma piada aleatória
  const loadJoke = useCallback(() => {
    fetch('https://api.chucknorris.io/jokes/random')
      .then((response) => response.json())
      .then((data) => {
        setJoke(data.value); // Atualiza a piada original
        if (data.value.trim() !== '') { // Verifica se a piada não está vazia
          translateJoke(data.value); // Traduz a piada para português
        } else {
          setTranslatedJoke('Nenhuma piada disponível para tradução.');
        }
      })
      .catch((error) => {
        console.error('Error loading joke:', error);
        setJoke('Falha ao carregar a piada.');
      });
  }, []); //Dependencia vazias

  // Função para traduzir a piada usando a API LibreTranslate
  const translateJoke = (text) => {
    fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: encodeURIComponent(text), // Codifica o texto
        source: 'en',
        target: 'pt',
        format: 'text',
      }),      
    })
      .then((response) => {
        if (!response.ok) {
          // Loga o código de status e a resposta para diagnóstico
          console.error('Translation error:', response.status, response.statusText);
          throw new Error('Failed to translate joke');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Translation successful:', data); // Loga a resposta bem-sucedida
        setTranslatedJoke(data.translatedText); // Atualiza o estado com a piada traduzida
      })
      .catch((error) => {
        console.error('Error translating joke:', error.message);
        setTranslatedJoke('Falha ao traduzir a piada.');
      });
  };

  // Carrega uma piada ao iniciar
  useEffect(() => {
    loadJoke();
  }, [loadJoke]); // Inclui loadJoke como dependência

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

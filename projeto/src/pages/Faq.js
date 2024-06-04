import React, { useState } from 'react';
import './Faq.css';

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const FAQ_DATA = [
    {
      question: 'Como posso fazer um pedido?',
      answer: 'Para fazer um pedido, basta navegar até à página de produtos, escolher o produto desejado e seguir as instruções de checkout.',
    },
    {
      question: 'Qual é o prazo de entrega dos produtos?',
      answer: 'O prazo de entrega pode variar dependendo da localização e do método de envio escolhido. Geralmente, os produtos são entregues dentro de 5 a 7 dias úteis.',
    },
    {
      question: 'Quais são os métodos de pagamento aceites na loja?',
      answer: 'Aceitamos os seguintes métodos de pagamento: cartão de crédito, cartão de débito, PayPal e transferência bancária.',
    },
    {
      question: 'Oferecem portes grátis?',
      answer: 'Sim, oferecemos portes grátis para pedidos acima de 100,00€ para todo lado de Portugual.',
    },
    {
      question: 'Como posso acompanhar o meu pedido?',
      answer: 'Assim que o seu pedido for despachado, irá receber um e-mail com o número de rastreio. Poderá acompanhar o estado do seu pedido utilizando esse número no site da transportadora.',
    },
    {
      question: 'Posso trocar ou devolver um produto?',
      answer: 'Sim, pode solicitar a troca ou devolução de um produto até 30 dias após a receção. Entre em contacto connosco para obter mais informações sobre o processo de devolução.',
    },
    {
      question: 'Oferecem garantia nos produtos?',
      answer: 'Sim, oferecemos garantia de 1 ano para todos os produtos vendidos na nossa loja. Se encontrar algum defeito de fabrico, entre em contacto connosco para obter assistência.',
    },
    {
      question: 'Como posso entrar em contacto com o suporte ao cliente?',
      answer: 'Pode entrar em contacto com o nosso suporte ao cliente através do e-mail contacto@lojadoexemplo.com.br ou pelo telefone (XX) XXXX-XXXX. Estamos disponíveis de segunda a sexta, das 9h às 18h.',
    },
    {
      question: 'Têm uma loja física?',
      answer: 'Atualmente, operamos apenas online e não temos uma loja física. Isso permite-nos oferecer preços mais competitivos e uma maior variedade de produtos.',
    },
    {
      question: 'Posso cancelar o meu pedido?',
      answer: 'Sim, pode cancelar o seu pedido antes de ser despachado. Após o despacho, entre em contacto connosco para solicitar o cancelamento e iremos ajudá-lo no processo.',
    },
    {
      question: 'Oferecem cupões de desconto?',
      answer: 'Sim, ocasionalmente oferecemos cupões de desconto para os nossos clientes. Esteja atento às nossas redes sociais e newsletter para ficar a par das promoções.',
    },
    {
      question: 'Como posso registar-me na loja?',
      answer: 'Para registar-se na nossa loja, basta clicar em "A Minha Conta" e seguir as instruções para criar uma conta. É rápido e fácil!',
    },
    // Adicione mais perguntas e respostas conforme necessário
  ];

  const toggleAnswer = (index) => {
    const answer = document.getElementById(`answer-${index}`);
    if (answer.style.display === "block") {
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">FAQs (Perguntas frequentes)</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍Pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="faq-search"
        />
      </div>
      <div className="faq-items">
        {FAQ_DATA.map((item, index) => (
          <div className="faq-item" key={index}>
            <h2 className="question" onClick={() => toggleAnswer(index)}>{item.question}</h2>
            <p id={`answer-${index}`} className="answer">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;

// Respostas tiradas do fluxo atual da loja (docs/paginas-e-fluxos.md). Confirmar com o cliente antes do lançamento
// e atualizar quando as regras de compra mudarem.
const QUESTIONS = [
  {
    question: "Quando recebo o acesso?",
    answer: "Logo após a confirmação do pagamento. O acesso é enviado automaticamente para o e-mail informado no checkout.",
  },
  {
    question: "Preciso criar uma conta?",
    answer: "Não. Para comprar, basta informar nome e e-mail no checkout.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Pix e cartão de crédito. O pagamento com criptomoedas será disponibilizado em breve.",
  },
];

/** Perguntas frequentes sobre a compra. Usa <details>, então abre e fecha sem JavaScript. */
export default function PurchaseFaq() {
  return (
    <div className="purchase-faq">
      {QUESTIONS.map(({ question, answer }) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

import Header from "@/components/Header";
import { ShoppingCart, CreditCard, Mail, Trophy, Calendar, Shield } from "lucide-react";

const ComoFunciona = () => {
  const steps = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "1. Escolha seus números",
      description: "Selecione a quantidade de números que deseja comprar. Quanto mais números, maior sua chance de ganhar!"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "2. Realize o pagamento",
      description: "Pague de forma segura com cartão, PIX, boleto ou débito. Seu pagamento é processado com total segurança."
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "3. Receba por e-mail",
      description: "Após o pagamento, você receberá por e-mail os números adquiridos e o comprovante de participação."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "4. Aguarde o sorteio",
      description: "No dia do sorteio, acompanhe ao vivo. Se um dos seus números for sorteado, você ganha o Porsche Taycan 2025!"
    }
  ];

  const faqs = [
    {
      question: "Como é feito o sorteio?",
      answer: "O sorteio será realizado de forma pública e transparente, utilizando a Loteria Federal como base para garantir total imparcialidade."
    },
    {
      question: "Posso comprar quantos números quiser?",
      answer: "Sim! Você pode comprar de 1 até 100.000 números. Lembrando que a partir de 1.000 números, cada um sai por apenas R$ 0,05."
    },
    {
      question: "Como saberei se ganhei?",
      answer: "Entraremos em contato imediatamente por telefone e e-mail. Além disso, divulgaremos o resultado no site e redes sociais."
    },
    {
      question: "O que acontece se eu ganhar?",
      answer: "Você receberá o Porsche Taycan 2025 completamente quitado, com toda a documentação em seu nome."
    },
    {
      question: "Posso ver meus números comprados?",
      answer: "Sim! Na área 'Meus Números' você pode visualizar todos os números que comprou e acompanhar o status do sorteio."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Como <span className="text-gradient-primary">Funciona</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Participe do sorteio, compre números e concorra a um Porsche Taycan 2025.
              Totalmente seguro e transparente.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Security */}
            <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-elegant)] border border-border">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Segurança Total</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Pagamento criptografado
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Dados protegidos por SSL
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Empresa registrada
                </li>
              </ul>
            </div>

            {/* Deadline */}
            <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-elegant)] border border-border">
              <div className="text-center mb-6">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Prazo do Sorteio</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">47 dias</div>
                <p className="text-muted-foreground">
                  O sorteio será realizado quando atingirmos 100% das vendas ou na data limite.
                </p>
              </div>
            </div>

            {/* Prize */}
            <div className="bg-gradient-gold text-accent rounded-2xl p-8 shadow-[var(--shadow-secondary)]">
              <div className="text-center mb-6">
                <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Prêmio</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">R$ 1.535.000</div>
                <p className="text-accent/80">
                  Porsche Taycan 2025 completamente quitado em seu nome.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-elegant)] border border-border">
            <h2 className="text-3xl font-bold text-center mb-8">
              Perguntas <span className="text-gradient-primary">Frequentes</span>
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border pb-6 last:border-b-0">
                  <h3 className="text-lg font-bold mb-3 text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComoFunciona;
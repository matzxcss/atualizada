import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Calculator, Shield, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ComprarRifas = () => {
  const [quantity, setQuantity] = useState(100); // Quantidade mínima
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showMinQuantityError, setShowMinQuantityError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, [user]);

  const calculatePrice = (qty: number) => {
    if (qty >= 1000) {
      return qty * 0.05;
    }
    return qty * 0.10;
  };

  const totalPrice = calculatePrice(quantity);

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value) || 0;
    const newQuantity = Math.max(100, Math.min(num, 10000)); // Mínimo 100, máximo 10000
    setQuantity(newQuantity);
    
    // Mostra erro se tentar comprar menos que 100
    if (num < 100 && num > 0) {
      setShowMinQuantityError(true);
      setTimeout(() => setShowMinQuantityError(false), 3000);
    } else {
      setShowMinQuantityError(false);
    }
  };

  const handleQuickSelect = (quickQuantity: number) => {
    setQuantity(quickQuantity);
    setShowMinQuantityError(false);
  };

  const handlePurchase = async () => {
    if (!user) {
      // Redireciona para auth com aba de cadastro pré-selecionada
      navigate('/auth?tab=register');
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para comprar números.",
        variant: "destructive",
      });
      return;
    }

    if (quantity < 100) {
      setShowMinQuantityError(true);
      toast({
        title: "Quantidade mínima",
        description: "A compra mínima é de 100 números.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Send Kwai pixel event for initiated checkout
      try {
        await supabase.functions.invoke('kwai-pixel-event', {
          body: {
            clickid: "placeholder_clickid", // Replace with actual click ID if available
            event_name: "EVENT_INITIATED_CHECKOUT",
            is_attributed: 1,
            mmpcode: "PL",
            pixelId: "288750686779301", // Corrected Kwai Pixel ID
            pixelSdkVersion: "9.9.9",
            properties: {
              content_id: `raffle_${quantity}`,
              content_type: "raffle",
              content_name: `numeros Porsche Taycan - ${quantity} números`,
            },
            testFlag: false,
            third_party: "Supabase",
            trackFlag: true,
          }
        });
        console.log("Kwai pixel 'Initiated Checkout' event sent.");
      } catch (pixelError) {
        console.error("Error sending Kwai pixel event:", pixelError);
        // Do not block the purchase flow if pixel event fails
      }

      const { data, error } = await supabase.functions.invoke('purchase', {
        body: { quantity }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redireciona diretamente para o Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não encontrada');
      }

    } catch (error: any) {
      console.error('Erro detalhado na compra:', error);

      let description = "Ocorreu um erro ao processar sua compra. Tente novamente mais tarde.";
      
      // Supabase function errors often return a JSON string in the message
      if (error.message) {
        try {
          // The error message might be prefixed, find the start of the JSON
          const jsonStart = error.message.indexOf('{');
          if (jsonStart !== -1) {
            const errorObj = JSON.parse(error.message.substring(jsonStart));
            if (errorObj.error) {
              description = errorObj.error;
            }
          } else {
            description = error.message;
          }
        } catch (e) {
          // Not a JSON error, use the raw message if it's informative
          description = error.message;
        }
      }

      toast({
        title: "Erro na Compra",
        description: description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-hero-responsive font-bold text-foreground mb-4">
              Comprar <span className="text-gradient-primary">Números</span>
            </h1>
            <meta name="description" content="Compre números do sorteio e concorra ao Porsche Taycan 2025. Números a partir de R$0,10. Promoção: 1000+ números por R$0,05 cada!" />
            <meta name="keywords" content="números, porsche, taycan, carro, sorteio, comprar números, números da sorte" />
            {userProfile ? (
              <p className="text-responsive text-muted-foreground">
                Bem-vindo(a), <span className="font-semibold text-primary">{userProfile.full_name}</span>! 
                Escolha quantos números deseja comprar.
              </p>
            ) : (
              <p className="text-responsive text-muted-foreground">
                Escolha a quantidade de números e participe do sorteio do Porsche Taycan 2025
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-elegant)] border border-border card-hover animate-slide-up">
              <div className="flex items-center mb-6">
                <Calculator className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Calculadora de números</h2>
              </div>

              <div className="space-y-6">
                {/* Botões de acionamento rápido */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Escolha rápida:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleQuickSelect(250)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        quantity === 250 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      250 números
                    </button>
                    <button
                      onClick={() => handleQuickSelect(500)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        quantity === 500 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      500 números
                    </button>
                    <button
                      onClick={() => handleQuickSelect(1000)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        quantity === 1000 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      1000 números
                    </button>
                  </div>
                </div>

                {/* Input manual */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantidade de Números (mínimo 100)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="input-mobile w-full text-center font-semibold touch-feedback"
                    min="100"
                    max="10000"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  
                  {/* Mensagem de erro para quantidade mínima */}
                  {showMinQuantityError && (
                    <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
                      <AlertCircle className="w-4 h-4 text-destructive mr-2" />
                      <span className="text-destructive text-sm font-medium">
                        A compra mínima é de 100 números.
                      </span>
                    </div>
                  )}
                </div>

                {/* Informações de preço */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Preço unitário:</span>
                    <span className="text-lg font-bold text-primary">
                      {quantity >= 1000 ? (
                        <span className="text-secondary">R$ 0,05 (PROMOÇÃO!)</span>
                      ) : (
                        <span>R$ 0,10</span>
                      )}
                    </span>
                  </div>
                  {quantity >= 1000 && (
                    <div className="text-sm text-secondary font-semibold">
                      🎉 Promoção ativa! Todos os números por R$ 0,05 cada!
                    </div>
                  )}
                  {quantity >= 500 && quantity < 1000 && (
                    <div className="text-sm text-muted-foreground">
                      💡 Compre 1000 números e pague apenas R$ 0,05 cada!
                    </div>
                  )}
                </div>

                <div className="bg-gradient-primary p-6 rounded-xl text-primary-foreground">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Total a Pagar</div>
                    <div className="text-4xl font-bold">
                      R$ {totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePurchase}
                  disabled={loading || quantity < 100}
                  className="w-full btn-hero disabled:opacity-50 disabled:cursor-not-allowed touch-feedback animate-scale-in"
                >
                  {loading ? '⏳ Processando...' : `🛒 Comprar ${quantity.toLocaleString('pt-BR')} ${quantity === 1 ? 'número' : 'números'}`}
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              {/* Pricing Info */}
              <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-elegant)] border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  💰 Tabela de Preços
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gradient-primary text-primary-foreground rounded-lg">
                    <span>100 a 999 números</span>
                    <span className="font-bold">R$ 0,10 cada</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gradient-secondary text-secondary-foreground rounded-lg">
                    <span>1000+ números (PROMOÇÃO)</span>
                    <span className="font-bold">R$ 0,05 cada</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    * Compra mínima de 100 números
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-elegant)] border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-primary mr-2" />
                  Segurança e Transparência
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Pagamento 100% seguro
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Números garantidos por e-mail
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Sorteio público e transparente
                  </li>
                </ul>
              </div>

              {/* Payment Methods */}
              <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-elegant)] border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 text-primary mr-2" />
                  Formas de Pagamento
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted p-3 rounded-lg text-center text-sm font-medium">
                    💳 Cartão
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center text-sm font-medium">
                    📱 PIX
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center text-sm font-medium">
                    🏦 Boleto
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center text-sm font-medium">
                    💰 Débito
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComprarRifas;
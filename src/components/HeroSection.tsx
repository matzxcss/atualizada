import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Users, Clock } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";
import porscheImage from "@/assets/porsche-taycan/porsche-hero.jpeg";

const HeroSection = () => {
  const [soldTickets, setSoldTickets] = useState(842758);
  const totalTickets = 1000000;
  const progressPercentage = (soldTickets / totalTickets) * 100;

  // Simulate real-time ticket sales
  useEffect(() => {
    const interval = setInterval(() => {
      setSoldTickets(prev => {
        const newCount = prev + Math.floor(Math.random() * 5) + 1;
        return newCount > totalTickets ? totalTickets : newCount;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent"></div>
      </div>

             <div className="container mx-auto px-4 py-8 md:py-12">
         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
           {/* Left Content */}
           <div className="text-center lg:text-left space-y-6 md:space-y-8">
            <div className="space-y-4">
                             <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
                 Concorra ao
                 <span className="block text-gradient-gold">
                   Porsche Taycan
                 </span>
                 <span className="text-3xl sm:text-4xl md:text-5xl">2025</span>
               </h1>
              
                             <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 max-w-xl mx-auto lg:mx-0">
                 Compre seu número e concorra ao Porsche Taycan 2025! 
                 Números a partir de <span className="text-secondary font-bold">R$0,10</span>
               </p>
            </div>

                         {/* Promotion Banner */}
             <div className="bg-secondary text-secondary-foreground p-4 md:p-6 rounded-xl pulse-glow">
               <div className="text-center">
                 <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                   🎯 PROMOÇÃO IMPERDÍVEL!
                 </div>
                 <div className="text-base sm:text-lg md:text-xl">
                   1.000 números ou mais: <span className="font-bold">R$0,05 cada!</span>
                 </div>
               </div>
             </div>

                         {/* Call to Action Buttons */}
             <div className="flex flex-col items-center gap-4">
               <AuthButton />
               <Link to="/como-funciona" className="btn-accent text-center text-lg px-8 py-3">
                 Como Funciona
               </Link>
             </div>

                         {/* Social Proof */}
             <div className="bg-card/20 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-border/20">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                                     <div className="text-xl sm:text-2xl font-bold text-primary-foreground counter-animate">
                     {soldTickets.toLocaleString('pt-BR')}
                   </div>
                   <div className="text-xs sm:text-sm text-primary-foreground/80">
                     Números Vendidos
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex justify-center">
                     <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
                   </div>
                   <div className="text-xl sm:text-2xl font-bold text-primary-foreground">
                     R$ 1.535.000
                   </div>
                   <div className="text-xs sm:text-sm text-primary-foreground/80">
                     Valor do Prêmio
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex justify-center">
                     <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
                   </div>
                   <div className="text-xl sm:text-2xl font-bold text-primary-foreground">
                     47 dias
                   </div>
                   <div className="text-xs sm:text-sm text-primary-foreground/80">
                     Para o Sorteio
                   </div>
                 </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-primary-foreground/80 mb-2">
                  <span>Progresso da Rifa</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-accent/30 rounded-full h-3">
                  <div 
                    className="bg-gradient-secondary h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

                     {/* Right Content - Car Image */}
           <div className="relative mt-8 lg:mt-0">
             <div className="relative z-10">
               <img
                 src={porscheImage}
                 alt="Porsche Taycan 2025"
                 className="w-full max-w-md lg:max-w-none lg:w-4/5 h-64 sm:h-80 md:h-96 object-cover rounded-2xl shadow-[var(--shadow-elegant)] transform hover:scale-105 transition-[var(--transition-smooth)] mx-auto"
               />
               
               {/* Floating Badge */}
               <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-gold text-accent px-3 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-[var(--shadow-secondary)] pulse-glow">
                 🏆 R$ 1.535.000
               </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-secondary/20 rounded-full blur-xl"></div>
             <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-primary/20 rounded-full blur-xl"></div>
           </div>
        </div>
      </div>

             {/* Urgency Message */}
       <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-center px-4">
         <div className="bg-primary text-primary-foreground px-4 py-2 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-lg pulse-glow">
           ⚡ Mais de {soldTickets.toLocaleString('pt-BR')} números vendidos! Corra para garantir os seus!
         </div>
       </div>
    </section>
  );
};

export default HeroSection;
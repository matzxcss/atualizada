import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderAuthButton } from "@/components/HeaderAuthButton";
import { ModeToggle } from "@/components/ui/mode-toggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll para adicionar efeito blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Comprar Números", href: "/comprar" },
    { name: "Meus Números", href: "/minhas-numeros" },
    { name: "Como Funciona", href: "/como-funciona" },
  ];

  return (
    <header className={`bg-accent/95 backdrop-blur-md text-accent-foreground shadow-[var(--shadow-elegant)] sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-accent/98 backdrop-blur-lg' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6">
                 <div className="flex items-center justify-between h-14 md:h-16 lg:h-18">
          {/* Logo */}
                     <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
             <div className="text-lg sm:text-xl md:text-2xl font-bold text-gradient-gold">
               Prêmios do Buzeira
             </div>
           </Link>

          {/* Desktop Navigation */}
                     <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
             {navItems.map((item) => (
               <Link
                 key={item.name}
                 to={item.href}
                 className="text-accent-foreground hover:text-secondary transition-all duration-300 font-medium text-base xl:text-lg hover:scale-105 relative group"
               >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
                     <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <ModeToggle />
            <HeaderAuthButton />
          </div>

          {/* Mobile Actions */}
                     <div className="flex lg:hidden items-center space-x-2 sm:space-x-3">
            <ModeToggle />
            
            {/* Mobile menu button - Hamburger animado */}
                         <button
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="lg:hidden text-accent-foreground hover:text-secondary transition-all duration-300 p-1.5 sm:p-2 hover:bg-accent-foreground/10 rounded-lg relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
               aria-label="Toggle menu"
             >
               <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center">
                 <span className={`block w-4 sm:w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
                 <span className={`block w-4 sm:w-5 h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                 <span className={`block w-4 sm:w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
               </div>
             </button>
          </div>
        </div>

        {/* Mobile Navigation - Slide Animation */}
                 <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="py-3 md:py-4 border-t border-border/20 backdrop-blur-sm">
             <nav className="flex flex-col space-y-1">
               {navItems.map((item, index) => (
                 <Link
                   key={item.name}
                   to={item.href}
                   className={`text-accent-foreground hover:text-secondary hover:bg-accent-foreground/5 transition-all duration-300 font-medium text-base md:text-lg py-2.5 md:py-3 px-3 md:px-4 rounded-lg relative group transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                  style={{ 
                    transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms' 
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
                </Link>
              ))}
              <div className={`mt-4 px-4 transform transition-all duration-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`} style={{ transitionDelay: isMenuOpen ? `${navItems.length * 100}ms` : '0ms' }}>
                <HeaderAuthButton />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
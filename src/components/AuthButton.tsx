import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const AuthButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleComprarRifa = () => {
    if (!user) {
      navigate('/auth?tab=register');
    } else {
      navigate('/comprar');
    }
  };

  if (user) {
    return (
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <Button 
          onClick={handleComprarRifa} 
          className="btn-hero text-lg sm:text-xl md:text-2xl font-bold px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 animate-pulse-gold shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7)] transition-all duration-300"
        >
          🏆 Comprar Números
        </Button>
        <Button 
          onClick={signOut} 
          variant="outline" 
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3"
        >
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleComprarRifa} 
      className="btn-hero text-lg sm:text-xl md:text-2xl font-bold px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 animate-pulse-gold shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7)] transition-all duration-300"
    >
      🏆 Comprar Números
    </Button>
  );
};
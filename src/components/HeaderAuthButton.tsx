import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const HeaderAuthButton = () => {
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
             <div className="flex items-center gap-1.5 sm:gap-2">
         <Button 
           onClick={handleComprarRifa} 
           className="bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm"
         >
           Comprar Rifa
         </Button>
         <Button 
           onClick={signOut} 
           variant="outline" 
           className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
         >
           Sair
         </Button>
       </div>
    );
  }

     return (
     <Button 
       onClick={handleComprarRifa} 
       className="bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm"
     >
       Comprar Rifa
     </Button>
   );
};

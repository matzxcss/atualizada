import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import RegistrationForm from '@/components/RegistrationForm';
import LoginForm from '@/components/LoginForm';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verifica se há parâmetro na URL para definir a aba inicial
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-md">
          {isLogin ? <LoginForm /> : <RegistrationForm />}
          
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary-glow text-sm underline transition-colors"
            >
              {isLogin 
                ? 'Não tem conta? Criar uma agora' 
                : 'Já tem conta? Fazer login'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
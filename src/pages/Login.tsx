
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation d'une connexion réussie
    toast({
      title: "Connexion réussie",
      description: "Vous êtes maintenant connecté à Prisma GestCab",
    });
    
    // Redirection vers la page d'accueil après connexion
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        {/* Header avec logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <Stethoscope className="h-8 w-8" />
            <span className="text-xl font-bold">Prisma GestCab</span>
          </Link>
        </div>

        {/* Titre de la page */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Se connecter</h1>
          <p className="text-gray-600">Accédez à votre cabinet médical</p>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              className="mt-1"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Se connecter
          </Button>
        </form>

        {/* Liens additionnels */}
        <div className="text-center mt-6 space-y-2">
          <Link 
            to="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
          <div className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline">
              S'inscrire
            </Link>
          </div>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

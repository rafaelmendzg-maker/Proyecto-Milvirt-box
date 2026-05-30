import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        
        await login(formData.email, formData.password);
        
      } else {
        
        if (formData.password !== formData.confirmPassword) {
          setMessage(' Las contraseñas no coinciden');
          setIsLoading(false);
          return;
        }
        
        await register(formData.email, formData.password);
        setMessage(' Cuenta creada. Ahora inicia sesión.');
        
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ email: '', password: '', confirmPassword: '' });
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      if (error.message.includes('Invalid login credentials')) {
        setMessage('Email o contraseña incorrectos');
      } else if (error.message.includes('User already registered')) {
        setMessage('El email ya está registrado');
      } else {
        setMessage(` Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <h2 className="auth-title">           MILVIRT       </h2>
        <p className="auth-subtitle">Acceso restringido - Personal autorizado</p>
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="operador@milbox.mil"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
          )}
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Cargando...' : isLogin ? ' Iniciar Sesión' : ' Crear Cuenta'}
          </button>
          {message && <div className="auth-message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
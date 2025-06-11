import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, AlertCircle } from 'lucide-react';
import { validateCPF, formatCPF, formatCEP } from '@/utils/validation';
import { useCEPQuery } from '@/hooks/useCEP';

const UserForm = ({ user, isOpen, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    ...user
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [shouldFetchCEP, setShouldFetchCEP] = useState(false);

  const {
    data: cepData,
    isLoading: cepLoading,
    error: cepError,
    refetch: refetchCEP,
  } = useCEPQuery(formData.cep, {
    enabled: shouldFetchCEP && formData.cep.replace(/\D/g, '').length === 8,
  });

  useEffect(() => {
    if (cepData && shouldFetchCEP) {
      setFormData(prev => ({
        ...prev,
        logradouro: cepData.logradouro || prev.logradouro,
        bairro: cepData.bairro || prev.bairro,
        cidade: cepData.cidade || prev.cidade,
        estado: cepData.estado || prev.estado,
      }));
      
      setErrors(prev => ({ ...prev, cep: '' }));
      setShouldFetchCEP(false);
    }
  }, [cepData, shouldFetchCEP]);

  useEffect(() => {
    if (cepError && shouldFetchCEP) {
      setErrors(prev => ({ ...prev, cep: cepError.message }));
      setShouldFetchCEP(false);
    }
  }, [cepError, shouldFetchCEP]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
      const cleanCEP = value.replace(/\D/g, '');
      
      if (cleanCEP.length === 8) {
        setShouldFetchCEP(true);
      }
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (formData.cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = 'CEP deve ter 8 dígitos';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitError('');
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error.message || 'Erro ao salvar usuário');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nome: '',
        cpf: '',
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
        ...user
      });
      setErrors({});
      setSubmitError('');
      setShouldFetchCEP(false);
    }
  }, [isOpen, user]);

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className={errors.nome ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              maxLength={14}
              placeholder="000.000.000-00"
              className={errors.cpf ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
          </div>

          <div>
            <Label htmlFor="cep">CEP *</Label>
            <Input
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              maxLength={9}
              placeholder="00000-000"
              className={errors.cep ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
            {cepLoading && (
              <p className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                <Loader2 className="animate-spin" size={12} />
                Buscando CEP...
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="logradouro">Logradouro</Label>
            <Input
              id="logradouro"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleChange}
              placeholder="Rua, Avenida, etc."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            <Input
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              maxLength={2}
              placeholder="UF"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || cepLoading}
            >
              {loading && <Loader2 className="animate-spin mr-2" size={16} />}
              {user ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;


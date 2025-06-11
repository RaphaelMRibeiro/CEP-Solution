import React, { useState } from 'react';
import { MapPin, Plus, User, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import UserForm from '@/components/forms/UserForm';
import UsersTable from '@/components/tables/UsersTable';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { useUsuarios } from '@/hooks/useUsuarios';
import './App.css';

const App = () => {
  const {
    usuarios,
    loading,
    error,
    carregarUsuarios,
    criarUsuario,
    criarUsuarioComCep,
    atualizarUsuario,
    deletarUsuario,
    isCreating,
    isUpdating,
    isDeleting,
  } = useUsuarios();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await deletarUsuario(userToDelete.id);
      setIsConfirmOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const handleSubmitUser = async (userData) => {
    try {
      if (editingUser) {
        await atualizarUsuario(editingUser.id, userData);
      } else {
        const hasOnlyBasicData = userData.nome && userData.cpf && userData.cep && 
                                !userData.logradouro && !userData.bairro && 
                                !userData.cidade && !userData.estado;
        
        if (hasOnlyBasicData) {
          await criarUsuarioComCep({
            nome: userData.nome,
            cpf: userData.cpf,
            cep: userData.cep
          });
        } else {
          await criarUsuario(userData);
        }
      }
      
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleRefresh = () => {
    carregarUsuarios();
  };

  const operationLoading = isCreating || isUpdating || isDeleting;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="text-blue-600" size={28} />
                Gerenciamento de Endereços
              </h1>
              <p className="text-gray-600 mt-1">
                Cadastre e gerencie endereços de usuários
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  'Atualizar'
                )}
              </Button>
              <Button
                onClick={handleAddUser}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Novo Usuário
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User size={20} />
              Usuários Cadastrados ({usuarios.length})
              {loading && <Loader2 className="animate-spin ml-2" size={16} />}
            </h2>
          </div>
          
          <UsersTable 
            users={usuarios}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            loading={loading}
          />
        </div>

        <UserForm
          user={editingUser}
          isOpen={isModalOpen}
          onSubmit={handleSubmitUser}
          onCancel={handleCloseModal}
          loading={operationLoading}
        />

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o usuário "${userToDelete?.nome}"? Esta ação não pode ser desfeita.`}
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default App;


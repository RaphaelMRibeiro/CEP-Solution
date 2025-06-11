import React from 'react';
import { Edit, Trash2, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const UsersTable = ({ users, onEdit, onDelete, loading = false }) => {
  if (loading && users.length === 0) {
    return (
      <div className="text-center py-12">
        <Loader2 size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
        <p className="text-gray-500 text-lg">Carregando usuários...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">Nenhum usuário cadastrado</p>
        <p className="text-gray-400 text-sm">Clique em "Novo Usuário" para começar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dados Pessoais</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>CEP</TableHead>
            <TableHead>Cidade/Estado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.nome}
                  </div>
                  <div className="text-sm text-gray-500">
                    CPF: {user.cpf}
                  </div>
                  {user.id && (
                    <div className="text-xs text-gray-400">
                      ID: {user.id}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-900">
                  {user.logradouro || '-'}
                </div>
                <div className="text-sm text-gray-500">
                  {user.bairro || '-'}
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {user.cep}
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-900">
                  {user.cidade || '-'}
                </div>
                <div className="text-sm text-gray-500">
                  {user.estado || '-'}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-700"
                    disabled={loading}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(user)}
                    className="text-red-600 hover:text-red-700"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/api';
import config from '@/config';

export const QUERY_KEYS = {
  USUARIOS: ['usuarios'],
  USUARIO: (id) => ['usuarios', id],
  USUARIO_CPF: (cpf) => ['usuarios', 'cpf', cpf],
};

export const useUsuariosQuery = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USUARIOS,
    queryFn: () => apiService.listarUsuarios(),
    staleTime: config.QUERY.STALE_TIME,
    gcTime: config.QUERY.GC_TIME,
    retry: config.QUERY.RETRY_COUNT,
    retryDelay: config.QUERY.RETRY_DELAY,
    ...options,
  });
};

export const useUsuarioQuery = (id, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USUARIO(id),
    queryFn: () => apiService.buscarUsuarioPorId(id),
    enabled: !!id && options.enabled !== false,
    staleTime: config.QUERY.STALE_TIME,
    gcTime: config.QUERY.GC_TIME,
    retry: config.QUERY.RETRY_COUNT,
    retryDelay: config.QUERY.RETRY_DELAY,
    ...options,
  });
};

export const useUsuarioCPFQuery = (cpf, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USUARIO_CPF(cpf),
    queryFn: () => apiService.buscarUsuarioPorCpf(cpf),
    enabled: !!cpf && options.enabled !== false,
    staleTime: config.QUERY.STALE_TIME,
    gcTime: config.QUERY.GC_TIME,
    retry: config.QUERY.RETRY_COUNT,
    retryDelay: config.QUERY.RETRY_DELAY,
    ...options,
  });
};

export const useCriarUsuarioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dadosUsuario) => apiService.criarUsuario(dadosUsuario),
    onSuccess: (novoUsuario) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USUARIOS });
      
      queryClient.setQueryData(QUERY_KEYS.USUARIO(novoUsuario.id), novoUsuario);
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
    },
  });
};

export const useCriarUsuarioComCepMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados) => apiService.criarUsuarioComCep(dados),
    onSuccess: (novoUsuario) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USUARIOS });
      
      queryClient.setQueryData(QUERY_KEYS.USUARIO(novoUsuario.id), novoUsuario);
    },
    onError: (error) => {
      console.error('Erro ao criar usuário com CEP:', error);
    },
  });
};

export const useAtualizarUsuarioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dadosUsuario }) => apiService.atualizarUsuario(id, dadosUsuario),
    onSuccess: (usuarioAtualizado, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USUARIOS });
      
      queryClient.setQueryData(QUERY_KEYS.USUARIO(id), usuarioAtualizado);
    },
    onError: (error) => {
      console.error('Erro ao atualizar usuário:', error);
    },
  });
};

export const useDeletarUsuarioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apiService.deletarUsuario(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USUARIO(id) });
      
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USUARIOS });
    },
    onError: (error) => {
      console.error('Erro ao deletar usuário:', error);
    },
  });
};

export const useUsuarios = () => {
  const usuariosQuery = useUsuariosQuery();
  const criarUsuarioMutation = useCriarUsuarioMutation();
  const criarUsuarioComCepMutation = useCriarUsuarioComCepMutation();
  const atualizarUsuarioMutation = useAtualizarUsuarioMutation();
  const deletarUsuarioMutation = useDeletarUsuarioMutation();

  return {
    usuarios: usuariosQuery.data || [],
    
    loading: usuariosQuery.isLoading || 
             criarUsuarioMutation.isPending || 
             criarUsuarioComCepMutation.isPending ||
             atualizarUsuarioMutation.isPending || 
             deletarUsuarioMutation.isPending,
    
    error: usuariosQuery.error?.message || 
           criarUsuarioMutation.error?.message ||
           criarUsuarioComCepMutation.error?.message ||
           atualizarUsuarioMutation.error?.message || 
           deletarUsuarioMutation.error?.message,

    carregarUsuarios: () => usuariosQuery.refetch(),
    
    criarUsuario: async (dadosUsuario) => {
      return criarUsuarioMutation.mutateAsync(dadosUsuario);
    },
    
    criarUsuarioComCep: async (dados) => {
      return criarUsuarioComCepMutation.mutateAsync(dados);
    },
    
    atualizarUsuario: async (id, dadosUsuario) => {
      return atualizarUsuarioMutation.mutateAsync({ id, dadosUsuario });
    },
    
    deletarUsuario: async (id) => {
      return deletarUsuarioMutation.mutateAsync(id);
    },

    buscarPorCpf: async (cpf) => {
      return apiService.buscarUsuarioPorCpf(cpf);
    },

    isCreating: criarUsuarioMutation.isPending || criarUsuarioComCepMutation.isPending,
    isUpdating: atualizarUsuarioMutation.isPending,
    isDeleting: deletarUsuarioMutation.isPending,
  };
};


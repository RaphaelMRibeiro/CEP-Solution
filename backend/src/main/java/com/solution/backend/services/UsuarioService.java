package com.solution.backend.services;

import com.solution.backend.entities.Usuario;
import com.solution.backend.entities.ViaCepResponse;
import com.solution.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);
    private final UsuarioRepository usuarioRepository;
    private final ViaCepService viaCepService;

    @Transactional
    public Usuario salvar(Usuario usuario) {
        log.info("Salvando usuário com CPF: {}", usuario.getCpf());

        Optional<Usuario> usuarioExistente = usuarioRepository.findByCpf(usuario.getCpf());
        if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(usuario.getId())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario salvarComCep(String nome, String cpf, String cep) {
        log.info("Salvando usuário com busca automática de CEP: {}", cep);

        ViaCepResponse dadosEndereco = viaCepService.buscarCep(cep);

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setCpf(cpf);
        usuario.setCep(dadosEndereco.getCep());
        usuario.setLogradouro(dadosEndereco.getLogradouro());
        usuario.setBairro(dadosEndereco.getBairro());
        usuario.setCidade(dadosEndereco.getLocalidade());
        usuario.setEstado(dadosEndereco.getUf());

        return salvar(usuario);
    }

    public List<Usuario> listarTodos() {
        log.info("Listando todos os usuários");
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        log.info("Buscando usuário por ID: {}", id);
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorCpf(String cpf) {
        log.info("Buscando usuário por CPF: {}", cpf);
        return usuarioRepository.findByCpf(cpf);
    }

    @Transactional
    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
        log.info("Atualizando usuário ID: {}", id);

        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!usuarioExistente.getCpf().equals(usuarioAtualizado.getCpf())) {
            if (usuarioRepository.existsByCpf(usuarioAtualizado.getCpf())) {
                throw new RuntimeException("CPF já cadastrado para outro usuário");
            }
        }

        usuarioExistente.setNome(usuarioAtualizado.getNome());
        usuarioExistente.setCpf(usuarioAtualizado.getCpf());
        usuarioExistente.setCep(usuarioAtualizado.getCep());
        usuarioExistente.setLogradouro(usuarioAtualizado.getLogradouro());
        usuarioExistente.setBairro(usuarioAtualizado.getBairro());
        usuarioExistente.setCidade(usuarioAtualizado.getCidade());
        usuarioExistente.setEstado(usuarioAtualizado.getEstado());

        return usuarioRepository.save(usuarioExistente);
    }

    @Transactional
    public void deletar(Long id) {
        log.info("Deletando usuário ID: {}", id);

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }

        usuarioRepository.deleteById(id);
    }
}
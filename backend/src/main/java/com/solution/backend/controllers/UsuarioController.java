package com.solution.backend.controllers;

import com.solution.backend.entities.Usuario;
import com.solution.backend.services.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private static final Logger log = LoggerFactory.getLogger(UsuarioController.class);
    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<?> criarUsuario(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario usuarioSalvo = usuarioService.salvar(usuario);
            log.info("Usuário criado com sucesso: {}", usuarioSalvo.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
        } catch (Exception e) {
            log.error("Erro ao criar usuário: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/com-cep")
    public ResponseEntity<?> criarUsuarioComCep(@RequestBody Map<String, String> dados) {
        try {
            String nome = dados.get("nome");
            String cpf = dados.get("cpf");
            String cep = dados.get("cep");

            if (nome == null || cpf == null || cep == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("erro", "Nome, CPF e CEP são obrigatórios"));
            }

            Usuario usuarioSalvo = usuarioService.salvarComCep(nome, cpf, cep);
            log.info("Usuário criado com CEP automático: {}", usuarioSalvo.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
        } catch (Exception e) {
            log.error("Erro ao criar usuário com CEP: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        log.info("Listando {} usuários", usuarios.size());
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(id);
        if (usuario.isPresent()) {
            log.info("Usuário encontrado: {}", id);
            return ResponseEntity.ok(usuario.get());
        } else {
            log.warn("Usuário não encontrado: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<?> buscarUsuarioPorCpf(@PathVariable String cpf) {
        Optional<Usuario> usuario = usuarioService.buscarPorCpf(cpf);
        if (usuario.isPresent()) {
            log.info("Usuário encontrado por CPF: {}", cpf);
            return ResponseEntity.ok(usuario.get());
        } else {
            log.warn("Usuário não encontrado por CPF: {}", cpf);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Long id, @Valid @RequestBody Usuario usuario) {
        try {
            Usuario usuarioAtualizado = usuarioService.atualizar(id, usuario);
            log.info("Usuário atualizado: {}", id);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (Exception e) {
            log.error("Erro ao atualizar usuário {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id) {
        try {
            usuarioService.deletar(id);
            log.info("Usuário deletado: {}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erro ao deletar usuário {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }
}
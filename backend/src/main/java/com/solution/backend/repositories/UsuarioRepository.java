package com.solution.backend.repositories;

import com.solution.backend.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<com.solution.backend.entities.Usuario> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
}

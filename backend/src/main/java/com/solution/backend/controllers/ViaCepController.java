package com.solution.backend.controllers;

import com.solution.backend.entities.ViaCepResponse;
import com.solution.backend.services.ViaCepService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cep")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ViaCepController {

    private static final Logger log = LoggerFactory.getLogger(ViaCepController.class);
    private final ViaCepService viaCepService;

    @GetMapping("/{cep}")
    public ResponseEntity<?> buscarCep(@PathVariable String cep) {
        try {
            ViaCepResponse response = viaCepService.buscarCep(cep);
            log.info("CEP consultado com sucesso: {}", cep);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao consultar CEP {}: {}", cep, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }
}
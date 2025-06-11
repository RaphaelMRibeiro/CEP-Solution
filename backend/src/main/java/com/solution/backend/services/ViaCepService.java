package com.solution.backend.services;

import com.solution.backend.entities.ViaCepResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class ViaCepService {

    private final RestTemplate restTemplate;
    private static final String VIA_CEP_URL = "https://viacep.com.br/ws/{cep}/json/";

    public ViaCepService() {
        this.restTemplate = new RestTemplate();
    }

    public ViaCepResponse buscarCep(String cep) {
        try {
            String cepLimpo = cep.replaceAll("[^0-9]", "");

            if (cepLimpo.length() != 8) {
                throw new IllegalArgumentException("CEP deve conter 8 dígitos");
            }

            ViaCepResponse response = restTemplate.getForObject(
                    VIA_CEP_URL,
                    ViaCepResponse.class,
                    cepLimpo
            );

            if (response != null && response.isErro()) {
                throw new RuntimeException("CEP não encontrado");
            }

            return response;

        } catch (Exception e) {
            log.error("Erro ao buscar CEP: {}", e.getMessage());
            throw new RuntimeException("Erro ao consultar CEP: " + e.getMessage());
        }
    }
}

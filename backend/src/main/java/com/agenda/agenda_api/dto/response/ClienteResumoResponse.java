package com.agenda.agenda_api.dto.response;

import com.agenda.agenda_api.model.Cliente;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Schema(name = "DadosResumindosCliente", description = "Dados resumidos do cliente")
public record ClienteResumoResponse(
        Long id,
        String nome,
        String cpf,
        LocalDate dataNascimento,
        String endereco,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ClienteResumoResponse fromEntity(Cliente cliente) {
        return new ClienteResumoResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpf(),
                cliente.getDataNascimento(),
                cliente.getEndereco(),
                cliente.getCreatedAt(),
                cliente.getUpdatedAt()
        );
    }
}
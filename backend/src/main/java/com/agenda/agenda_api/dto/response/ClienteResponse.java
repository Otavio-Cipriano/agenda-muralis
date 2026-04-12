package com.agenda.agenda_api.dto.response;

import com.agenda.agenda_api.model.Cliente;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Schema(name = "DadosCliente", description = "Dados do cliente")
public record ClienteResponse(
        Long id,
        String nome,
        String cpf,
        LocalDate dataNascimento,
        String endereco,
        List<ContatoResponse> contatos,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ClienteResponse fromEntity(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpf(),
                cliente.getDataNascimento(),
                cliente.getEndereco(),
                cliente.getContatos().stream()
                        .map(ContatoResponse::fromEntity)
                        .toList(),
                cliente.getCreatedAt(),
                cliente.getUpdatedAt()
        );
    }
}
package com.agenda.agenda_api.dto.response;

import com.agenda.agenda_api.model.Cliente;

import java.time.LocalDate;
import java.util.List;

public record ClienteResponse(
        Long id,
        String nome,
        String cpf,
        LocalDate dataNascimento,
        String endereco,
        List<ContatoResponse> contatos
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
                        .toList()
        );
    }
}
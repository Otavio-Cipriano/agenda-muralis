package com.agenda.agenda_api.dto.response;

import com.agenda.agenda_api.enums.TipoContato;
import com.agenda.agenda_api.model.Contato;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(name = "DadosContato", description = "Dados do contato")
public record ContatoResponse(
        Long id,
        TipoContato tipo,
        String valor,
        String observacao,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ContatoResponse fromEntity(Contato contato) {
        return new ContatoResponse(
                contato.getId(),
                contato.getTipo(),
                contato.getValor(),
                contato.getObservacao(),
                contato.getCreatedAt(),
                contato.getUpdatedAt()
        );
    }
}

package com.agenda.agenda_api.dto.response;

import com.agenda.agenda_api.enums.TipoContato;
import com.agenda.agenda_api.model.Contato;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "DadosContato", description = "Dados do contato")
public record ContatoResponse(
        Long id,
        TipoContato tipo,
        String valor,
        String observacao
) {
    public static ContatoResponse fromEntity(Contato contato) {
        return new ContatoResponse(
                contato.getId(),
                contato.getTipo(),
                contato.getValor(),
                contato.getObservacao()
        );
    }
}

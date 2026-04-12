package com.agenda.agenda_api.dto.response;

import com.agenda.agenda_api.enums.TipoContato;
import com.agenda.agenda_api.model.Contato;

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

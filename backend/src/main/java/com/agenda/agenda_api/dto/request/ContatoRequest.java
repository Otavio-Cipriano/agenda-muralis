package com.agenda.agenda_api.dto.request;

import com.agenda.agenda_api.enums.TipoContato;
import com.agenda.agenda_api.model.Cliente;
import com.agenda.agenda_api.model.Contato;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ContatoRequest(
        @NotNull TipoContato tipo,
        @NotBlank String valor,
        String observacao
) {
    public Contato toEntity(Cliente cliente) {
        Contato contato = new Contato();
        contato.setTipo(this.tipo);
        contato.setValor(this.valor);
        contato.setObservacao(this.observacao);
        contato.setCliente(cliente);
        return contato;
    }
}

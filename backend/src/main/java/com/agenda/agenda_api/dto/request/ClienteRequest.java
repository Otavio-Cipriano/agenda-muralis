package com.agenda.agenda_api.dto.request;

import com.agenda.agenda_api.model.Cliente;
import com.agenda.agenda_api.model.Contato;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.List;

@Schema(name = "CadastroCliente", description = "Dados para cadastro de cliente")
public record ClienteRequest(
        @NotBlank String nome,
        @NotBlank String cpf,
        LocalDate dataNascimento,
        String endereco,
        List<ContatoRequest> contatos
) {
    public Cliente toEntity() {
        Cliente cliente = new Cliente();
        cliente.setNome(this.nome);
        cliente.setCpf(this.cpf);
        cliente.setDataNascimento(this.dataNascimento);
        cliente.setEndereco(this.endereco);


        if (this.contatos != null) {
            for (ContatoRequest contatoRequest : this.contatos) {
                Contato contato = contatoRequest.toEntity(cliente);
                cliente.getContatos().add(contato);
            }
        }

        return cliente;
    }
}

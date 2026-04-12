package com.agenda.agenda_api.dto.request;

import com.agenda.agenda_api.model.Cliente;
import com.agenda.agenda_api.model.Contato;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Schema(name = "CadastroCliente", description = "Dados para cadastro de cliente")
public record ClienteRequest(
        @Size(min = 2, max = 100)
        @Pattern(regexp = "^[a-zA-ZÀ-ú\\s]+$", message = "Nome deve conter apenas letras")
        @NotBlank
        String nome,
        @CPF @NotBlank String cpf,
        @Past(message = "Data de nascimento deve ser uma data passada")
        LocalDate dataNascimento,
        String endereco,
        List<ContatoRequest> contatos
) {
    public Cliente toEntity() {
        Cliente cliente = new Cliente();
        cliente.setNome(this.nome);
        cliente.setCpf(this.cpf.trim());
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

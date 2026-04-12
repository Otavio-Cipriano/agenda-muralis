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
import java.util.List;

public record ClienteResumoRequest(
        @Schema(example = "João Silva")
        @Size(min = 2, max = 100)
        @Pattern(regexp = "^[\\p{L}\\s'-]+$", message = "Nome deve conter apenas letras")
        @NotBlank
        String nome,
        @CPF(message = "CPF inválido")
        @NotBlank
        String cpf,
        @Past(message = "Data de nascimento deve ser uma data passada")
        LocalDate dataNascimento,
        String endereco
) {
    public Cliente toEntity() {
        Cliente cliente = new Cliente();
        cliente.setNome(this.nome);
        cliente.setCpf(this.cpf.trim());
        cliente.setDataNascimento(this.dataNascimento);
        cliente.setEndereco(this.endereco);

        return cliente;
    }
}
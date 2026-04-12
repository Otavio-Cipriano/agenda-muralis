package com.agenda.agenda_api.service;

import com.agenda.agenda_api.dto.request.ContatoRequest;
import com.agenda.agenda_api.model.Cliente;
import com.agenda.agenda_api.model.Contato;
import com.agenda.agenda_api.repository.ClienteRepository;
import com.agenda.agenda_api.repository.ContatoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContatoService {

    private final ContatoRepository contatoRepository;
    private final ClienteRepository clienteRepository;

    public ContatoService(ContatoRepository contatoRepository, ClienteRepository clienteRepository) {
        this.contatoRepository = contatoRepository;
        this.clienteRepository = clienteRepository;
    }

    public Page<Contato> list(Pageable pageable) {
        return contatoRepository.findAll(pageable);
    }

    public Contato create(Long clienteId, ContatoRequest request) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Contato contato = request.toEntity(cliente);
        return contatoRepository.save(contato);
    }


    public Contato update(Long id, ContatoRequest request) {
        Contato contato = contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado"));

        contato.setTipo(request.tipo());
        contato.setValor(request.valor());
        contato.setObservacao(request.observacao());

        return contatoRepository.save(contato);
    }

    public void delete(Long id) {
        contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado"));
        contatoRepository.deleteById(id);
    }
}

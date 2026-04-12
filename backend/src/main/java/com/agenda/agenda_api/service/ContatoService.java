package com.agenda.agenda_api.service;

import com.agenda.agenda_api.model.Contato;
import com.agenda.agenda_api.repository.ClienteRepository;
import com.agenda.agenda_api.repository.ContatoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContatoService {

    private final ContatoRepository contatoRepository;
    private final ClienteRepository clienteRepository;

    public ContatoService(ContatoRepository contatoRepository, ClienteRepository clienteRepository){
        this.contatoRepository = contatoRepository;
        this.clienteRepository = clienteRepository;
    }

    public List<Contato> list(){
        return contatoRepository.findAll();
    }

    public Contato create(Contato contato){
        return contatoRepository.save(contato);
    }

    public Contato update(Long id, Contato contatoAtualizado){
        Contato contato = contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado"));

        contato.setTipo(contatoAtualizado.getTipo());
        contato.setValor(contatoAtualizado.getValor());
        contato.setObservacao(contatoAtualizado.getObservacao());

        return contatoRepository.save(contato);
    }

    public void delete (Long id){
        contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não Encontrado"));
        contatoRepository.deleteById(id);
    }
}

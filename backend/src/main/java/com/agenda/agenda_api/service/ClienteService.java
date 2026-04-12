package com.agenda.agenda_api.service;

import com.agenda.agenda_api.model.Cliente;
import com.agenda.agenda_api.repository.ClienteRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ClienteService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public Cliente create(Cliente cliente) {
        Cliente salvo = clienteRepository.save(cliente);
        entityManager.refresh(salvo);
        return salvo;
    }

    public Page<Cliente> list(Pageable pageable) {
        return clienteRepository.findAll(pageable);
    }

    @Transactional
    public Cliente findById(Long id){
        return clienteRepository.findByIdWithContatos(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public Cliente update(Long id, Cliente clienteAtualizado) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        cliente.setNome(clienteAtualizado.getNome());
        cliente.setCpf(clienteAtualizado.getCpf());
        cliente.setDataNascimento(clienteAtualizado.getDataNascimento());
        cliente.setEndereco(clienteAtualizado.getEndereco());

        return clienteRepository.save(cliente);
    }

    public void delete(Long id) {
        clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        clienteRepository.deleteById(id);
    }
}
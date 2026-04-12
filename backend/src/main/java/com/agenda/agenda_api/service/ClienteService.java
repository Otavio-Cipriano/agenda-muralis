package com.agenda.agenda_api.service;

import com.agenda.agenda_api.model.Cliente;
import com.agenda.agenda_api.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente create(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public List<Cliente> list() {
        return clienteRepository.findAll();
    }

    public Cliente getCliente(Long id){
        return clienteRepository.findById(id)
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
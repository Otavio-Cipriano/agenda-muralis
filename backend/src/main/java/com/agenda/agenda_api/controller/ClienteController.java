package com.agenda.agenda_api.controller;

import com.agenda.agenda_api.dto.request.ClienteRequest;
import com.agenda.agenda_api.dto.request.ClienteResumoRequest;
import com.agenda.agenda_api.dto.request.ContatoRequest;
import com.agenda.agenda_api.dto.response.ClienteResponse;
import com.agenda.agenda_api.dto.response.ClienteResumoResponse;
import com.agenda.agenda_api.dto.response.ContatoResponse;
import com.agenda.agenda_api.service.ClienteService;
import com.agenda.agenda_api.service.ContatoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/clientes")
@Tag(name = "Clientes", description = "Gerenciamento de clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final ContatoService contatoService;

    public ClienteController(ClienteService clienteService, ContatoService contatoService) {
        this.clienteService = clienteService;
        this.contatoService = contatoService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> create(@RequestBody @Valid ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ClienteResponse.fromEntity(clienteService.create(request.toEntity())));
    }

    @GetMapping
    public ResponseEntity<Page<ClienteResumoResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(clienteService.list(pageable)
                .map(ClienteResumoResponse::fromEntity));
    }

    @PostMapping("/{id}/contatos")
    public ResponseEntity<ContatoResponse> addContato(
            @PathVariable Long id,
            @RequestBody @Valid ContatoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ContatoResponse.fromEntity(contatoService.create(id, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> getClienteById(@PathVariable Long id){
        return ResponseEntity.ok(ClienteResponse.fromEntity(clienteService.findById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ClienteResumoResponse>> search(
            @RequestParam String busca, Pageable pageable) {
        return ResponseEntity.ok(clienteService.search(busca, pageable)
                .map(ClienteResumoResponse::fromEntity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResumoResponse> update(@PathVariable Long id, @RequestBody @Valid ClienteResumoRequest request) {
        return ResponseEntity.ok(ClienteResumoResponse.fromEntity(clienteService.update(id, request.toEntity())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
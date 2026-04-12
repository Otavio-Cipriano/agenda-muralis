package com.agenda.agenda_api.controller;

import com.agenda.agenda_api.dto.request.ClienteRequest;
import com.agenda.agenda_api.dto.response.ClienteResponse;
import com.agenda.agenda_api.model.Cliente;
import com.agenda.agenda_api.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> create(@RequestBody @Valid ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ClienteResponse.fromEntity(clienteService.create(request.toEntity())));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> list() {
        return ResponseEntity.ok(clienteService.list().stream()
                .map(ClienteResponse::fromEntity)
                .toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> update(@PathVariable Long id, @RequestBody @Valid ClienteRequest request) {
        return ResponseEntity.ok(ClienteResponse.fromEntity(clienteService.update(id, request.toEntity())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
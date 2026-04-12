package com.agenda.agenda_api.controller;

import com.agenda.agenda_api.dto.request.ContatoRequest;
import com.agenda.agenda_api.dto.response.ContatoResponse;
import com.agenda.agenda_api.service.ContatoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contatos")
@Tag(name = "Contatos", description = "Gerenciamento de contatos")
public class ContatoController {
    private final ContatoService contatoService;

    public ContatoController(ContatoService contatoService) {
        this.contatoService = contatoService;
    }

    @GetMapping
    public ResponseEntity<Page<ContatoResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(contatoService.list(pageable)
                .map(ContatoResponse::fromEntity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContatoResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid ContatoRequest request) {
        return ResponseEntity.ok(ContatoResponse.fromEntity(contatoService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contatoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

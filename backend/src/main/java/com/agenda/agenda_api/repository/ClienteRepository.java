package com.agenda.agenda_api.repository;

import com.agenda.agenda_api.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    @Query("SELECT c FROM Cliente c LEFT JOIN FETCH c.contatos WHERE c.id = :id")
    Optional<Cliente> findByIdWithContatos(@Param("id") Long id);

    @Query("SELECT c FROM Cliente c WHERE c.nome LIKE %:busca% OR c.cpf = :busca")
    Page<Cliente> findByNomeOrCpf(@Param("busca") String busca, Pageable pageable);
}

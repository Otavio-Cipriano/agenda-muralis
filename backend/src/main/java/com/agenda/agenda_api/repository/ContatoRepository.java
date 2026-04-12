package com.agenda.agenda_api.repository;

import com.agenda.agenda_api.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContatoRepository extends JpaRepository<Contato, Long> {
}

package com.agenda.agenda_api.model;

import com.agenda.agenda_api.enums.TipoContato;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contatos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "clientes_id", nullable = false)
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TipoContato tipo;

    @Column(nullable = false, length = 100)
    private String valor;

    @Column(length = 255)
    private String observacao;
}
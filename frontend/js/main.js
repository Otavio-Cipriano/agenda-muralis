const API_URL = 'http://localhost:8080/';
const TAMANHO_PAGINA = 20;
const CORES = ['primary', 'success', 'danger', 'warning', 'info', 'secondary'];

let clientes = [];
let paginaAtual = 0;
let totalPaginas = 0;
let totalElementos = 0;
let clienteAtualId = null;
// ─── API ──────────────────────────────────────────────────────────────────────

async function buscarClientes(page = 0, size = TAMANHO_PAGINA) {
    mostrarLoading(true);
    try {
        const response = await fetch(`${API_URL}clientes?page=${page}&size=${size}`);

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const data = await response.json();
        console.log('Resposta da API:', data);
        clientes = data.content.map(c => ({
            id:   c.id,
            nome: c.nome,
            cpf:  c.cpf,
            nasc: c.dataNascimento,
            end:  c.endereco,
            cad:  c.createdAt ? c.createdAt.split('T')[0] : '—',
            ativo: true // ajuste se sua API retornar esse campo
        }));

        paginaAtual    = data.number;
        totalPaginas   = data.totalPages;
        totalElementos = data.totalElements;

        renderizar(clientes);
        renderizarPaginacao();

    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        document.getElementById('tbody').innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Não foi possível carregar os clientes. Verifique se a API está rodando.
                </td>
            </tr>`;
    } finally {
        mostrarLoading(false);
    }
}

async function buscarClientePorId(id) {
    try {
        const response = await fetch(`${API_URL}clientes/${id}`);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar cliente ${id}:`, error);
        return null;
    }
}

// ─── RENDER ───────────────────────────────────────────────────────────────────

function renderizar(lista) {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">Nenhum cliente encontrado.</td>
            </tr>`;
        return;
    }

    lista.forEach((c, i) => {
        const cor = CORES[i % CORES.length];
        tbody.innerHTML += `
        <tr>
            <td class="ps-3"><input type="checkbox" class="form-check-input"></td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0"
                        style="width:36px;height:36px;font-size:13px;background:var(--bs-${cor});">
                        ${iniciais(c.nome)}
                    </div>
                    <div>
                        <div class="fw-medium" style="font-size:14px;">${c.nome}</div>
                        <div class="text-muted d-md-none" style="font-size:12px;">${c.cpf}</div>
                    </div>
                </div>
            </td>
            <td class="text-muted hide-mobile" style="font-size:14px;">${c.cpf}</td>
            <td class="hide-mobile" style="font-size:14px;">
                <div>${formatarData(c.nasc)}</div>
                <div class="text-muted" style="font-size:12px;">${calcularIdade(c.nasc)} anos</div>
            </td>
            <td style="font-size:13px;max-width:180px;white-space:normal;">${c.end}</td>
            <td class="text-center">
                <span class="badge rounded-pill badge-status ${c.ativo ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
                    ${c.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="text-end pe-3">
                <div class="d-flex gap-1 justify-content-end">
                    <button class="btn btn-sm btn-outline-info btn-icon" title="Ver detalhes" onclick="abrirDetalhes(${c.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary btn-icon" title="Editar" onclick="abrirEditar(${c.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-icon" title="Excluir" onclick="confirmarDeletarCliente(${c.id}, '${c.nome}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });

    document.getElementById('totalLabel').textContent =
        `Exibindo ${lista.length} de ${totalElementos} clientes`;
}

function renderizarPaginacao() {
    const nav = document.getElementById('paginacao');
    nav.innerHTML = '';

    const anterior = `<li class="page-item ${paginaAtual === 0 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="irParaPagina(${paginaAtual - 1})">‹</a>
    </li>`;

    const proxima = `<li class="page-item ${paginaAtual >= totalPaginas - 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="irParaPagina(${paginaAtual + 1})">›</a>
    </li>`;

    let paginas = '';
    for (let i = 0; i < totalPaginas; i++) {
        paginas += `<li class="page-item ${i === paginaAtual ? 'active' : ''}">
            <a class="page-link" href="#" onclick="irParaPagina(${i})">${i + 1}</a>
        </li>`;
    }

    nav.innerHTML = anterior + paginas + proxima;
}

// ─── MODAL DETALHES ───────────────────────────────────────────────────────────

async function abrirDetalhes(id) {
    const c = await buscarClientePorId(id);
    if (!c) {
        alert('Não foi possível carregar os detalhes do cliente.');
        return;
    }
    clienteAtualId = c.id; 
    const idx = clientes.findIndex(cl => cl.id === id);
    const cor = CORES[idx % CORES.length];

    document.getElementById('mdAvatar').textContent = iniciais(c.nome);
    document.getElementById('mdAvatar').style.background = `var(--bs-${cor})`;
    document.getElementById('mdNome').textContent = c.nome;
    document.getElementById('mdCpf').textContent = c.cpf;
    document.getElementById('mdNasc').textContent = formatarData(c.dataNascimento);
    document.getElementById('mdIdade').textContent = calcularIdade(c.dataNascimento) + ' anos';
    document.getElementById('mdCad').textContent = c.createdAt ? formatarData(c.createdAt.split('T')[0]) : '—';
    document.getElementById('mdEnd').textContent = c.endereco;

    // Contatos
    const icones = { TELEFONE: '📞', EMAIL: '✉️' };
    const contatosHtml = c.contatos && c.contatos.length > 0
        ? c.contatos.map(ct => `
            <div class="d-flex align-items-start gap-2 py-2 border-bottom">
                <span style="font-size:16px">${icones[ct.tipo] || '📋'}</span>
                <div>
                    <div style="font-size:13px;font-weight:500;">${ct.valor}</div>
                    <div style="font-size:11px;color:var(--bs-secondary);">
                        ${ct.tipo}${ct.observacao ? ' · ' + ct.observacao : ''}
                    </div>
                </div>
            </div>`).join('')
        : `<p class="text-muted" style="font-size:13px;">Nenhum contato cadastrado.</p>`;

    document.getElementById('mdContatos').innerHTML = contatosHtml;

    new bootstrap.Modal(document.getElementById('modalDetalhes')).show();
}

// ─── EDIÇÃO ───────────────────────────────────────────────────────────────────

let clienteEmEdicao = null;

async function abrirEditar(id) {
    const c = await buscarClientePorId(id);
    if (!c) { alert('Não foi possível carregar os dados do cliente.'); return; }

    clienteEmEdicao = c;

    document.getElementById('editNome').value = c.nome || '';
    document.getElementById('editCpf').value  = c.cpf  || '';
    document.getElementById('editNasc').value = c.dataNascimento || '';
    document.getElementById('editEnd').value  = c.endereco || '';

    renderizarContatos(c.contatos || []);

    new bootstrap.Modal(document.getElementById('modalEditar')).show();
}

function renderizarContatos(contatos) {
    const lista = document.getElementById('listaContatos');

    if (contatos.length === 0) {
        lista.innerHTML = `<p class="text-muted" style="font-size:13px;" id="semContatos">Nenhum contato cadastrado.</p>`;
        return;
    }

    lista.innerHTML = contatos.map((ct) => `
        <div class="row g-2 align-items-end mb-2 contato-row" data-id="${ct.id ?? ''}">
            <div class="col-12 col-md-3">
                <label class="form-label" style="font-size:12px;">Tipo</label>
                <select class="form-select form-select-sm ct-tipo" onchange="marcarEditado(this)">
                    <option ${ct.tipo === 'TELEFONE' ? 'selected' : ''}>TELEFONE</option>
                    <option ${ct.tipo === 'EMAIL'    ? 'selected' : ''}>EMAIL</option>
                </select>
            </div>
            <div class="col-12 col-md-3">
                <label class="form-label" style="font-size:12px;">Valor</label>
                <input type="text" class="form-control form-control-sm ct-valor" value="${ct.valor || ''}" oninput="marcarEditado(this)">
            </div>
            <div class="col-12 col-md-4">
                <label class="form-label" style="font-size:12px;">Observação</label>
                <input type="text" class="form-control form-control-sm ct-obs" value="${ct.observacao || ''}" oninput="marcarEditado(this)">
            </div>
            <div class="col-auto mb-1 d-flex gap-1 acoes-contato">
                <button class="btn btn-sm btn-outline-success btn-icon d-none btn-salvar-contato" title="Salvar contato" onclick="salvarContato(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-icon" title="Remover contato" onclick="confirmarRemoverContato(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </div>
        </div>`).join('');
}

// aparece o botão de salvar ao editar qualquer campo
function marcarEditado(el) {
    const row = el.closest('.contato-row');
    row.querySelector('.btn-salvar-contato').classList.remove('d-none');
}

async function salvarContato(btn) {
    const row = btn.closest('.contato-row');
    const id  = row.dataset.id;

    const payload = {
        tipo:        row.querySelector('.ct-tipo').value,
        valor:       row.querySelector('.ct-valor').value,
        observacao:  row.querySelector('.ct-obs').value,
        valorValido: true
    };

    try {
        const response = await fetch(`http://localhost:8080/contatos/${id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        btn.classList.add('d-none'); // esconde o botão de salvar após sucesso
    } catch (error) {
        console.error('Erro ao salvar contato:', error);
        alert('Não foi possível salvar o contato.');
    }
}

// ─── REMOVER CONTATO COM CONFIRMAÇÃO ─────────────────────────────────────────

let contatoParaRemover = null;

function confirmarRemoverContato(btn) {
    const row = btn.closest('.contato-row');
    contatoParaRemover = { btn, row, id: row.dataset.id };
    new bootstrap.Modal(document.getElementById('modalConfirmarDelete')).show();
}

async function executarRemoverContato() {
    if (!contatoParaRemover) return;

    const { row, id } = contatoParaRemover;

    try {
        const response = await fetch(`http://localhost:8080/contatos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        bootstrap.Modal.getInstance(document.getElementById('modalConfirmarDelete')).hide();
        row.remove();

        if (document.querySelectorAll('#listaContatos .contato-row').length === 0) {
            document.getElementById('listaContatos').innerHTML =
                `<p class="text-muted" style="font-size:13px;" id="semContatos">Nenhum contato cadastrado.</p>`;
        }

    } catch (error) {
        console.error('Erro ao remover contato:', error);
        alert('Não foi possível remover o contato.');
    } finally {
        contatoParaRemover = null;
    }
}

function adicionarContato() {
    const lista = document.getElementById('listaContatos');

    // remove aviso "nenhum contato"
    const aviso = document.getElementById('semContatos');
    if (aviso) aviso.remove();

    const novoId = `novo-${Date.now()}`;
    const div = document.createElement('div');
    div.className = 'row g-2 align-items-end mb-2 contato-row border rounded p-2';
    div.style.background = 'var(--bs-primary-bg-subtle)';
    div.dataset.id = '';
    div.innerHTML = `
        <div class="col-12 col-md-3">
            <label class="form-label" style="font-size:12px;">Tipo</label>
            <select class="form-select form-select-sm ct-tipo">
                <option>TELEFONE</option>
                <option>EMAIL</option>
            </select>
        </div>
        <div class="col-12 col-md-3">
            <label class="form-label" style="font-size:12px;">Valor</label>
            <input type="text" class="form-control form-control-sm ct-valor" placeholder="Ex: 11999999999">
        </div>
        <div class="col-12 col-md-4">
            <label class="form-label" style="font-size:12px;">Observação</label>
            <input type="text" class="form-control form-control-sm ct-obs" placeholder="Ex: Telefone pessoal">
        </div>
        <div class="col-auto mb-1 d-flex gap-1">
            <button class="btn btn-sm btn-outline-success btn-icon" title="Confirmar" onclick="confirmarNovoContato(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
            <button class="btn btn-sm btn-outline-danger btn-icon" title="Cancelar" onclick="cancelarNovoContato(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        </div>`;

    lista.appendChild(div);
}

async function confirmarNovoContato(btn) {
    const row = btn.closest('.contato-row');

    const payload = {
        tipo:       row.querySelector('.ct-tipo').value,
        valor:      row.querySelector('.ct-valor').value,
        observacao: row.querySelector('.ct-obs').value,
    };

    if (!payload.valor) {
        alert('Preencha o valor do contato.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/clientes/${clienteEmEdicao.id}/contatos`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const novoContato = await response.json();

        // atualiza o data-id da row com o id que veio da API
        row.dataset.id = novoContato.id;

        // remove highlight de "novo" e troca botões confirmar/cancelar pelo de remover
        row.classList.remove('border', 'rounded', 'p-2');
        row.style.background = '';

        const acoes = row.querySelector('.col-auto');
        acoes.innerHTML = `
            <button class="btn btn-sm btn-outline-success btn-icon d-none btn-salvar-contato" title="Salvar contato" onclick="salvarContato(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
            <button class="btn btn-sm btn-outline-danger btn-icon" title="Remover contato" onclick="confirmarRemoverContato(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>`;

        // remove aviso "nenhum contato" se existir
        const aviso = document.getElementById('semContatos');
        if (aviso) aviso.remove();

    } catch (error) {
        console.error('Erro ao adicionar contato:', error);
        alert('Não foi possível adicionar o contato.');
    }
}

function cancelarNovoContato(btn) {
    const row = btn.closest('.contato-row');
    row.remove();
    // se não sobrou nenhum contato, mostra aviso
    if (document.querySelectorAll('#listaContatos .contato-row').length === 0) {
        document.getElementById('listaContatos').innerHTML =
            `<p class="text-muted" style="font-size:13px;" id="semContatos">Nenhum contato cadastrado.</p>`;
    }
}

function removerContato(btn) {
    const row = btn.closest('.contato-row');
    row.remove();
    if (document.querySelectorAll('#listaContatos .contato-row').length === 0) {
        document.getElementById('listaContatos').innerHTML =
            `<p class="text-muted" style="font-size:13px;" id="semContatos">Nenhum contato cadastrado.</p>`;
    }
}

function irParaEdicao() {
    const modalDetalhes = bootstrap.Modal.getInstance(document.getElementById('modalDetalhes'));
    modalDetalhes.hide();

    document.getElementById('modalDetalhes').addEventListener('hidden.bs.modal', function handler() {
        document.getElementById('modalDetalhes').removeEventListener('hidden.bs.modal', handler);
        abrirEditar(clienteEmEdicao?.id ?? clienteAtualId);
    }, { once: true });
}

function salvarEdicao() {
    // monta o payload para quando for implementar o PUT
    const contatos = [...document.querySelectorAll('#listaContatos .contato-row')].map(row => ({
        id:         row.dataset.id || null,
        tipo:       row.querySelector('.ct-tipo').value,
        valor:      row.querySelector('.ct-valor').value,
        observacao: row.querySelector('.ct-obs').value,
    }));

    const payload = {
        id:              clienteEmEdicao.id,
        nome:            document.getElementById('editNome').value,
        cpf:             document.getElementById('editCpf').value,
        dataNascimento:  document.getElementById('editNasc').value,
        endereco:        document.getElementById('editEnd').value,
        contatos,
    };

    console.log('Payload para PUT:', payload);
    // TODO: fetch PUT /clientes/:id com payload
    bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
}

// ─── CRIAR CLIENTE ────────────────────────────────────────────────────────────

function abrirCriarCliente() {
    // limpa tudo ao abrir
    document.getElementById('criarNome').value = '';
    document.getElementById('criarCpf').value  = '';
    document.getElementById('criarNasc').value = '';
    document.getElementById('criarEnd').value  = '';
    document.getElementById('listaContatosNovo').innerHTML = '';
    document.getElementById('criarErro').classList.add('d-none');

    ['criarNome', 'criarCpf', 'criarNasc'].forEach(id => {
        document.getElementById(id).classList.remove('is-invalid');
    });

    new bootstrap.Modal(document.getElementById('modalCriar')).show();
}

function adicionarContatoNovo() {
    const lista = document.getElementById('listaContatosNovo');
    const div = document.createElement('div');
    div.className = 'row g-2 align-items-end mb-2 contato-row-novo border rounded p-2';
    div.style.background = 'var(--bs-primary-bg-subtle)';
    div.innerHTML = `
        <div class="col-12 col-md-3">
            <label class="form-label" style="font-size:12px;">Tipo</label>
            <select class="form-select form-select-sm ct-tipo">
                <option>TELEFONE</option>
                <option>EMAIL</option>
            </select>
        </div>
        <div class="col-12 col-md-3">
            <label class="form-label" style="font-size:12px;">Valor</label>
            <input type="text" class="form-control form-control-sm ct-valor" placeholder="Ex: 11999999999">
        </div>
        <div class="col-12 col-md-4">
            <label class="form-label" style="font-size:12px;">Observação</label>
            <input type="text" class="form-control form-control-sm ct-obs" placeholder="Ex: pessoal">
        </div>
        <div class="col-auto mb-1">
            <button class="btn btn-sm btn-outline-danger btn-icon" title="Remover" onclick="this.closest('.contato-row-novo').remove()">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        </div>`;
    lista.appendChild(div);
}

async function salvarNovoCliente() {
    // limpa erros anteriores
    document.getElementById('criarErro').classList.add('d-none');
    ['criarNome', 'criarCpf', 'criarNasc'].forEach(id => {
        document.getElementById(id).classList.remove('is-invalid');
    });

    const nome = document.getElementById('criarNome').value.trim();
    const cpf  = document.getElementById('criarCpf').value.trim();
    const nasc = document.getElementById('criarNasc').value;
    const end  = document.getElementById('criarEnd').value.trim();

    // validação frontend
    let valido = true;

    if (!nome) {
        document.getElementById('criarNome').classList.add('is-invalid');
        valido = false;
    }
    if (!cpf) {
        document.getElementById('criarCpf').classList.add('is-invalid');
        valido = false;
    }
    if (nasc) {
        const hoje = new Date().toISOString().split('T')[0];
        if (nasc >= hoje) {
            document.getElementById('criarNasc').classList.add('is-invalid');
            valido = false;
        }
    }

    if (!valido) return;

    const contatos = [...document.querySelectorAll('#listaContatosNovo .contato-row-novo')]
        .map(row => ({
            tipo:        row.querySelector('.ct-tipo').value,
            valor:       row.querySelector('.ct-valor').value,
            observacao:  row.querySelector('.ct-obs').value,
            valorValido: true
        }))
        .filter(ct => ct.valor.trim() !== ''); // ignora contatos sem valor

    const payload = { nome, cpf, dataNascimento: nasc || null, endereco: end, contatos };

    try {
        const response = await fetch('http://localhost:8080/clientes', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });

        if (!response.ok) {
            const erro = await response.json().catch(() => null);
            const msg  = erro?.message || erro?.error || JSON.stringify(erro) || `Erro ${response.status}`;
            const erroEl = document.getElementById('criarErro');
            erroEl.textContent = msg;
            erroEl.classList.remove('d-none');
            return;
        }

        bootstrap.Modal.getInstance(document.getElementById('modalCriar')).hide();
        await buscarClientes(paginaAtual, TAMANHO_PAGINA); // recarrega a tabela

    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        const erroEl = document.getElementById('criarErro');
        erroEl.textContent = 'Não foi possível conectar à API. Verifique se o servidor está rodando.';
        erroEl.classList.remove('d-none');
    }
}

// ─── DELETAR CLIENTE ──────────────────────────────────────────────────────────

let clienteParaDeletar = null;

function confirmarDeletarCliente(id, nome) {
    clienteParaDeletar = id;
    document.getElementById('deleteClienteNome').textContent = nome;
    new bootstrap.Modal(document.getElementById('modalConfirmarDeleteCliente')).show();
}

async function executarDeletarCliente() {
    if (!clienteParaDeletar) return;

    try {
        const response = await fetch(`http://localhost:8080/clientes/${clienteParaDeletar}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        bootstrap.Modal.getInstance(document.getElementById('modalConfirmarDeleteCliente')).hide();
        await buscarClientes(paginaAtual, TAMANHO_PAGINA);

    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        alert('Não foi possível remover o cliente.');
    } finally {
        clienteParaDeletar = null;
    }
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

function iniciais(nome) {
    return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function formatarData(d) {
    if (!d) return '—';
    const [y, m, dd] = d.split('-');
    return `${dd}/${m}/${y}`;
}

function calcularIdade(nasc) {
    const d = new Date(nasc), h = new Date();
    let a = h.getFullYear() - d.getFullYear();
    if (h < new Date(h.getFullYear(), d.getMonth(), d.getDate())) a--;
    return a;
}

function mostrarLoading(show) {
    if (show) {
        document.getElementById('tbody').innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                    Carregando clientes...
                </td>
            </tr>`;
    }
}

function filtrar() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtrados = clientes.filter(c =>
        c.nome.toLowerCase().includes(q) ||
        c.cpf.includes(q) ||
        c.end.toLowerCase().includes(q)
    );
    renderizar(filtrados);
}

function toggleAll(cb) {
    document.querySelectorAll('#tbody input[type=checkbox]').forEach(el => el.checked = cb.checked);
}

async function irParaPagina(page) {
    if (page < 0 || page >= totalPaginas) return;
    await buscarClientes(page, TAMANHO_PAGINA);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    buscarClientes();
});
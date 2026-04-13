// ─── CONFIG ───────────────────────────────────────────────────────────────────

const API_URL       = 'http://localhost:8080';
const TAMANHO_PAGINA = 20;
const CORES         = ['primary', 'success', 'danger', 'warning', 'info', 'secondary'];

// ─── ESTADO ───────────────────────────────────────────────────────────────────

let clientes         = [];
let paginaAtual      = 0;
let totalPaginas     = 0;
let totalElementos   = 0;
let clienteAtualId   = null;   // id aberto no modal de detalhes
let clienteEmEdicao  = null;   // objeto completo aberto no modal de edição
let contatoParaRemover  = null;
let clienteParaDeletar  = null;

// ─── MÁSCARA CPF ──────────────────────────────────────────────────────────────

function mascaraCpf(valor) {
    return valor
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function aplicarMascaraCpf(el) {
    el.addEventListener('input', function () {
        const pos = this.selectionStart;
        const antes = this.value.length;
        this.value = mascaraCpf(this.value);
        const depois = this.value.length;
        // reposiciona cursor de forma natural
        this.setSelectionRange(pos + (depois - antes), pos + (depois - antes));
    });
}

function validarCpf(cpf) {
    const nums = cpf.replace(/\D/g, '');
    if (nums.length !== 11 || /^(\d)\1+$/.test(nums)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
    let r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(nums[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    return r === parseInt(nums[10]);
}

// ─── API — CLIENTES ───────────────────────────────────────────────────────────

async function buscarClientes(page = 0, size = TAMANHO_PAGINA) {
    mostrarLoading(true);
    try {
        const res = await fetch(`${API_URL}/clientes?page=${page}&size=${size}`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);

        const data = await res.json();
        _preencherEstado(data);
        renderizar(clientes);
        renderizarPaginacao();
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        _erroTabela('Não foi possível carregar os clientes. Verifique se a API está rodando.');
    } finally {
        mostrarLoading(false);
    }
}

async function buscarClientePorId(id) {
    try {
        const res = await fetch(`${API_URL}/clientes/${id}`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(`Erro ao buscar cliente ${id}:`, err);
        return null;
    }
}

async function buscarPorTermo(termo, page = 0, size = TAMANHO_PAGINA) {
    mostrarLoading(true);
    try {
        const params = new URLSearchParams({ busca: termo, page, size });
        const res = await fetch(`${API_URL}/clientes/search?${params}`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);

        const data = await res.json();
        _preencherEstado(data);
        renderizar(clientes);
        renderizarPaginacao();
    } catch (err) {
        console.error('Erro na busca:', err);
        _erroTabela('Erro ao buscar clientes.');
    } finally {
        mostrarLoading(false);
    }
}

// ─── API — CONTATOS ───────────────────────────────────────────────────────────

async function _putContato(id, payload) {
    const res = await fetch(`${API_URL}/contatos/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return res.json();
}

async function _deleteContato(id) {
    const res = await fetch(`${API_URL}/contatos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
}

async function _postContato(clienteId, payload) {
    const res = await fetch(`${API_URL}/clientes/${clienteId}/contatos`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return res.json();
}

// ─── RENDER — TABELA ─────────────────────────────────────────────────────────

function renderizar(lista) {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    if (!lista.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Nenhum cliente encontrado.</td></tr>`;
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
            <td style="font-size:13px;max-width:180px;white-space:normal;">${c.end ?? '—'}</td>
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
    const nav   = document.getElementById('paginacao');
    const termo = document.getElementById('searchInput').value.trim();
    const irPara = page => termo ? buscarPorTermo(termo, page) : buscarClientes(page);

    let html = `<li class="page-item ${paginaAtual === 0 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="event.preventDefault();(${irPara})(${paginaAtual - 1})">‹</a></li>`;

    for (let i = 0; i < totalPaginas; i++) {
        html += `<li class="page-item ${i === paginaAtual ? 'active' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault();(${irPara})(${i})">${i + 1}</a></li>`;
    }

    html += `<li class="page-item ${paginaAtual >= totalPaginas - 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="event.preventDefault();(${irPara})(${paginaAtual + 1})">›</a></li>`;

    nav.innerHTML = html;
}

// ─── MODAL — DETALHES ─────────────────────────────────────────────────────────

async function abrirDetalhes(id) {
    const c = await buscarClientePorId(id);
    if (!c) { alert('Não foi possível carregar os detalhes do cliente.'); return; }

    clienteAtualId = c.id;

    const idx = clientes.findIndex(cl => cl.id === id);
    const cor = CORES[idx % CORES.length];

    document.getElementById('mdAvatar').textContent        = iniciais(c.nome);
    document.getElementById('mdAvatar').style.background   = `var(--bs-${cor})`;
    document.getElementById('mdNome').textContent          = c.nome;
    document.getElementById('mdCpf').textContent           = c.cpf;
    document.getElementById('mdNasc').textContent          = formatarData(c.dataNascimento);
    document.getElementById('mdIdade').textContent         = calcularIdade(c.dataNascimento) + ' anos';
    document.getElementById('mdCad').textContent           = c.createdAt ? formatarData(c.createdAt.split('T')[0]) : '—';
    document.getElementById('mdEnd').textContent           = c.endereco ?? '—';

    const st = document.getElementById('mdStatus');
    st.textContent = 'Ativo';
    st.className   = 'badge rounded-pill mt-1 bg-success-subtle text-success';

    const icones = { TELEFONE: '📞', EMAIL: '✉️' };
    document.getElementById('mdContatos').innerHTML = c.contatos?.length
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

    new bootstrap.Modal(document.getElementById('modalDetalhes')).show();
}

function irParaEdicao() {
    const modalDetalhes = bootstrap.Modal.getInstance(document.getElementById('modalDetalhes'));
    modalDetalhes.hide();
    document.getElementById('modalDetalhes').addEventListener('hidden.bs.modal', function handler() {
        document.getElementById('modalDetalhes').removeEventListener('hidden.bs.modal', handler);
        abrirEditar(clienteAtualId);
    }, { once: true });
}

// ─── MODAL — CRIAR CLIENTE ────────────────────────────────────────────────────

function abrirCriarCliente() {
    ['criarNome', 'criarCpf', 'criarNasc', 'criarEnd'].forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.classList.remove('is-invalid');
    });
    document.getElementById('listaContatosNovo').innerHTML = '';
    document.getElementById('criarErro').classList.add('d-none');
    new bootstrap.Modal(document.getElementById('modalCriar')).show();
}

function adicionarContatoNovo() {
    const div = document.createElement('div');
    div.className = 'row g-2 align-items-end mb-2 contato-row-novo border rounded p-2';
    div.style.background = 'var(--bs-primary-bg-subtle)';
    div.innerHTML = _htmlCamposContato() + `
        <div class="col-auto mb-1">
            <button class="btn btn-sm btn-outline-danger btn-icon" title="Remover" onclick="this.closest('.contato-row-novo').remove()">
                ${_iconX()}
            </button>
        </div>`;
    document.getElementById('listaContatosNovo').appendChild(div);
}

async function salvarNovoCliente() {
    document.getElementById('criarErro').classList.add('d-none');
    ['criarNome', 'criarCpf', 'criarNasc'].forEach(id =>
        document.getElementById(id).classList.remove('is-invalid'));

    const nome = document.getElementById('criarNome').value.trim();
    const cpf  = document.getElementById('criarCpf').value.trim();
    const nasc = document.getElementById('criarNasc').value;
    const end  = document.getElementById('criarEnd').value.trim();
    const hoje = new Date().toISOString().split('T')[0];

    let valido = true;
    if (!nome) { document.getElementById('criarNome').classList.add('is-invalid'); valido = false; }
    if (!cpf) {
        document.getElementById('criarCpf').classList.add('is-invalid');
        valido = false;
    } else if (!validarCpf(cpf)) {
        document.getElementById('criarCpf').classList.add('is-invalid');
        const feedback = document.getElementById('criarCpf').nextElementSibling;
        if (feedback) feedback.textContent = 'CPF inválido.';
        valido = false;
    }
    if (nasc && nasc >= hoje) { document.getElementById('criarNasc').classList.add('is-invalid'); valido = false; }
    if (!valido) return;

    const contatos = [...document.querySelectorAll('#listaContatosNovo .contato-row-novo')]
        .map(row => ({
            tipo:        row.querySelector('.ct-tipo').value,
            valor:       row.querySelector('.ct-valor').value,
            observacao:  row.querySelector('.ct-obs').value,
            valorValido: true
        }))
        .filter(ct => ct.valor.trim());

    try {
        const res = await fetch(`${API_URL}/clientes`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                nome,
                cpf: cpf.replace(/\D/g, ''),
                dataNascimento: nasc || null,
                endereco: end,
                contatos
            })
        });

        if (!res.ok) {
            const erro = await res.json().catch(() => null);
            const msg  = erro?.message || erro?.error || JSON.stringify(erro) || `Erro ${res.status}`;
            const el   = document.getElementById('criarErro');
            el.textContent = msg;
            el.classList.remove('d-none');
            return;
        }

        bootstrap.Modal.getInstance(document.getElementById('modalCriar')).hide();
        await buscarClientes(paginaAtual);
    } catch (err) {
        console.error('Erro ao criar cliente:', err);
        const el = document.getElementById('criarErro');
        el.textContent = 'Não foi possível conectar à API. Verifique se o servidor está rodando.';
        el.classList.remove('d-none');
    }
}

// ─── MODAL — EDITAR CLIENTE ───────────────────────────────────────────────────

async function abrirEditar(id) {
    const c = await buscarClientePorId(id);
    if (!c) { alert('Não foi possível carregar os dados do cliente.'); return; }

    clienteEmEdicao = c;

    document.getElementById('editNome').value = c.nome            || '';
    document.getElementById('editCpf').value  = c.cpf ? mascaraCpf(c.cpf) : '';
    document.getElementById('editNasc').value = c.dataNascimento  || '';
    document.getElementById('editEnd').value  = c.endereco        || '';

    // limpa erros anteriores
    ['editNome', 'editCpf'].forEach(id => document.getElementById(id).classList.remove('is-invalid'));

    renderizarContatos(c.contatos || []);
    new bootstrap.Modal(document.getElementById('modalEditar')).show();
}

function renderizarContatos(contatos) {
    const lista = document.getElementById('listaContatos');

    if (!contatos.length) {
        lista.innerHTML = `<p class="text-muted" style="font-size:13px;" id="semContatos">Nenhum contato cadastrado.</p>`;
        return;
    }

    lista.innerHTML = contatos.map(ct => `
        <div class="row g-2 align-items-end mb-2 contato-row" data-id="${ct.id ?? ''}">
            ${_htmlCamposContato(ct)}
            <div class="col-auto mb-1 d-flex gap-1">
                <button class="btn btn-sm btn-outline-success btn-icon d-none btn-salvar-contato" title="Salvar" onclick="salvarContato(this)">
                    ${_iconCheck()}
                </button>
                <button class="btn btn-sm btn-outline-danger btn-icon" title="Remover" onclick="confirmarRemoverContato(this)">
                    ${_iconX()}
                </button>
            </div>
        </div>`).join('');
}

function adicionarContato() {
    const aviso = document.getElementById('semContatos');
    if (aviso) aviso.remove();

    const div = document.createElement('div');
    div.className = 'row g-2 align-items-end mb-2 contato-row border rounded p-2';
    div.style.background = 'var(--bs-primary-bg-subtle)';
    div.dataset.id = '';
    div.innerHTML = _htmlCamposContato() + `
        <div class="col-auto mb-1 d-flex gap-1">
            <button class="btn btn-sm btn-outline-success btn-icon" title="Confirmar" onclick="confirmarNovoContato(this)">
                ${_iconCheck()}
            </button>
            <button class="btn btn-sm btn-outline-danger btn-icon" title="Cancelar" onclick="cancelarNovoContato(this)">
                ${_iconX()}
            </button>
        </div>`;
    document.getElementById('listaContatos').appendChild(div);
}

function marcarEditado(el) {
    el.closest('.contato-row').querySelector('.btn-salvar-contato').classList.remove('d-none');
}

async function salvarContato(btn) {
    const row = btn.closest('.contato-row');
    const valorInput = row.querySelector('.ct-valor');
    const valor = valorInput.value.trim();

    // Validação: valor não pode ser nulo/vazio
    if (!valor) {
        valorInput.classList.add('is-invalid');
        let fb = valorInput.nextElementSibling;
        if (!fb || !fb.classList.contains('invalid-feedback')) {
            fb = document.createElement('div');
            fb.className = 'invalid-feedback';
            valorInput.parentNode.insertBefore(fb, valorInput.nextSibling);
        }
        fb.textContent = 'O valor do contato é obrigatório.';
        return;
    }
    valorInput.classList.remove('is-invalid');

    try {
        await _putContato(row.dataset.id, {
            tipo:        row.querySelector('.ct-tipo').value,
            valor:       valor,
            observacao:  row.querySelector('.ct-obs').value,
            valorValido: true
        });
        btn.classList.add('d-none');
    } catch (err) {
        console.error('Erro ao salvar contato:', err);
        alert('Não foi possível salvar o contato.');
    }
}

async function confirmarNovoContato(btn) {
    const row     = btn.closest('.contato-row');
    const valorInput = row.querySelector('.ct-valor');
    const payload = {
        tipo:       row.querySelector('.ct-tipo').value,
        valor:      valorInput.value.trim(),
        observacao: row.querySelector('.ct-obs').value,
    };

    // Validação: valor não pode ser nulo/vazio
    if (!payload.valor) {
        valorInput.classList.add('is-invalid');
        let fb = valorInput.nextElementSibling;
        if (!fb || !fb.classList.contains('invalid-feedback')) {
            fb = document.createElement('div');
            fb.className = 'invalid-feedback';
            valorInput.parentNode.insertBefore(fb, valorInput.nextSibling);
        }
        fb.textContent = 'Preencha o valor do contato.';
        return;
    }
    valorInput.classList.remove('is-invalid');

    try {
        const novoContato = await _postContato(clienteEmEdicao.id, payload);
        row.dataset.id = novoContato.id;
        row.classList.remove('border', 'rounded', 'p-2');
        row.style.background = '';
        row.querySelector('.col-auto').innerHTML = `
            <button class="btn btn-sm btn-outline-success btn-icon d-none btn-salvar-contato" title="Salvar" onclick="salvarContato(this)">${_iconCheck()}</button>
            <button class="btn btn-sm btn-outline-danger btn-icon" title="Remover" onclick="confirmarRemoverContato(this)">${_iconX()}</button>`;
        document.getElementById('semContatos')?.remove();
    } catch (err) {
        console.error('Erro ao adicionar contato:', err);
        alert('Não foi possível adicionar o contato.');
    }
}

function cancelarNovoContato(btn) {
    btn.closest('.contato-row').remove();
    if (!document.querySelectorAll('#listaContatos .contato-row').length) {
        document.getElementById('listaContatos').innerHTML =
            `<p class="text-muted" style="font-size:13px;" id="semContatos">Nenhum contato cadastrado.</p>`;
    }
}

function confirmarRemoverContato(btn) {
    const row = btn.closest('.contato-row');
    contatoParaRemover = { row, id: row.dataset.id };
    new bootstrap.Modal(document.getElementById('modalConfirmarDelete')).show();
}

async function executarRemoverContato() {
    if (!contatoParaRemover) return;
    const { row, id } = contatoParaRemover;
    try {
        await _deleteContato(id);
        bootstrap.Modal.getInstance(document.getElementById('modalConfirmarDelete')).hide();
        row.remove();
        if (!document.querySelectorAll('#listaContatos .contato-row').length) {
            document.getElementById('listaContatos').innerHTML =
                `<p class="text-muted" style="font-size:13px;" id="semContatos">Nenhum contato cadastrado.</p>`;
        }
    } catch (err) {
        console.error('Erro ao remover contato:', err);
        alert('Não foi possível remover o contato.');
    } finally {
        contatoParaRemover = null;
    }
}

function salvarEdicao() {
    // Validações do formulário de edição
    let valido = true;

    const nomeEl = document.getElementById('editNome');
    const cpfEl  = document.getElementById('editCpf');
    [nomeEl, cpfEl].forEach(el => el.classList.remove('is-invalid'));

    if (!nomeEl.value.trim()) {
        nomeEl.classList.add('is-invalid');
        valido = false;
    }

    const cpfVal = cpfEl.value.trim();
    if (!cpfVal) {
        cpfEl.classList.add('is-invalid');
        const fb = cpfEl.nextElementSibling;
        if (fb) fb.textContent = 'CPF é obrigatório.';
        valido = false;
    } else if (!validarCpf(cpfVal)) {
        cpfEl.classList.add('is-invalid');
        const fb = cpfEl.nextElementSibling;
        if (fb) fb.textContent = 'CPF inválido.';
        valido = false;
    }

    // Valida todos os contatos existentes — valor não pode ser vazio
    let contatosValidos = true;
    document.querySelectorAll('#listaContatos .contato-row').forEach(row => {
        const valorInput = row.querySelector('.ct-valor');
        if (!valorInput.value.trim()) {
            valorInput.classList.add('is-invalid');
            let fb = valorInput.nextElementSibling;
            if (!fb || !fb.classList.contains('invalid-feedback')) {
                fb = document.createElement('div');
                fb.className = 'invalid-feedback';
                valorInput.parentNode.insertBefore(fb, valorInput.nextSibling);
            }
            fb.textContent = 'O valor do contato é obrigatório.';
            contatosValidos = false;
        } else {
            valorInput.classList.remove('is-invalid');
        }
    });

    if (!valido || !contatosValidos) return;

    const payload = {
        id:             clienteEmEdicao.id,
        nome:           nomeEl.value.trim(),
        cpf:            cpfVal.replace(/\D/g, ''),
        dataNascimento: document.getElementById('editNasc').value,
        endereco:       document.getElementById('editEnd').value,
        contatos: [...document.querySelectorAll('#listaContatos .contato-row')].map(row => ({
            id:         row.dataset.id || null,
            tipo:       row.querySelector('.ct-tipo').value,
            valor:      row.querySelector('.ct-valor').value,
            observacao: row.querySelector('.ct-obs').value,
        }))
    };
    console.log('Payload para PUT:', payload);
    // TODO: fetch PUT /clientes/:id com payload
    bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
}

// ─── MODAL — DELETAR CLIENTE ──────────────────────────────────────────────────

function confirmarDeletarCliente(id, nome) {
    clienteParaDeletar = id;
    document.getElementById('deleteClienteNome').textContent = nome;
    new bootstrap.Modal(document.getElementById('modalConfirmarDeleteCliente')).show();
}

async function executarDeletarCliente() {
    if (!clienteParaDeletar) return;
    try {
        const res = await fetch(`${API_URL}/clientes/${clienteParaDeletar}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        bootstrap.Modal.getInstance(document.getElementById('modalConfirmarDeleteCliente')).hide();
        await buscarClientes(paginaAtual);
    } catch (err) {
        console.error('Erro ao deletar cliente:', err);
        alert('Não foi possível remover o cliente.');
    } finally {
        clienteParaDeletar = null;
    }
}

// ─── BUSCA ────────────────────────────────────────────────────────────────────

function filtrar() {
    const q = document.getElementById('searchInput').value.trim();
    if (!q) { buscarClientes(0); return; }
    document.getElementById('btnLimpar').style.display = '';
    buscarPorTermo(q);
}

function limparBusca() {
    document.getElementById('searchInput').value = '';
    document.getElementById('btnLimpar').style.display = 'none';
    buscarClientes(0);
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
            <tr><td colspan="7" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                Carregando clientes...
            </td></tr>`;
    }
}

function toggleAll(cb) {
    document.querySelectorAll('#tbody input[type=checkbox]').forEach(el => el.checked = cb.checked);
}

function _preencherEstado(data) {
    clientes       = data.content.map(c => ({
        id:   c.id,
        nome: c.nome,
        cpf:  c.cpf,
        nasc: c.dataNascimento,
        end:  c.endereco,
        cad:  c.createdAt ? c.createdAt.split('T')[0] : '—',
        ativo: true
    }));
    paginaAtual    = data.number;
    totalPaginas   = data.totalPages;
    totalElementos = data.totalElements;
}

function _erroTabela(msg) {
    document.getElementById('tbody').innerHTML =
        `<tr><td colspan="7" class="text-center text-danger py-4">${msg}</td></tr>`;
}

function _htmlCamposContato(ct = {}) {
    return `
        <div class="col-12 col-md-3">
            <label class="form-label" style="font-size:12px;">Tipo</label>
            <select class="form-select form-select-sm ct-tipo" onchange="marcarEditado(this)">
                <option ${ct.tipo === 'TELEFONE' ? 'selected' : ''}>TELEFONE</option>
                <option ${ct.tipo === 'EMAIL'    ? 'selected' : ''}>EMAIL</option>
            </select>
        </div>
        <div class="col-12 col-md-3">
            <label class="form-label" style="font-size:12px;">Valor <span class="text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm ct-valor"
                value="${ct.valor || ''}" placeholder="Ex: 11999999999" oninput="marcarEditado(this);this.classList.remove('is-invalid')">
            <div class="invalid-feedback">O valor do contato é obrigatório.</div>
        </div>
        <div class="col-12 col-md-4">
            <label class="form-label" style="font-size:12px;">Observação</label>
            <input type="text" class="form-control form-control-sm ct-obs"
                value="${ct.observacao || ''}" placeholder="Ex: pessoal" oninput="marcarEditado(this)">
        </div>`;
}

function _iconCheck() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
    </svg>`;
}

function _iconX() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>`;
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    buscarClientes();

    // Aplica máscara de CPF nos inputs estáticos do HTML
    aplicarMascaraCpf(document.getElementById('criarCpf'));
    aplicarMascaraCpf(document.getElementById('editCpf'));
});
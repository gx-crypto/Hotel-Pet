/* Hotel Pet - JavaScript puro: dados demonstrativos salvos no navegador. */
const CHAVES = {
    reservas: 'hotelpet_reservas',
    usuarios: 'hotelpet_usuarios',
    pets: 'hotelpet_pets',
    config: 'hotelpet_config'
};

function ler(chave, padrao) {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : padrao;
}
function gravar(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}
function reais(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function diasEntre(inicio, fim) {
    if (!inicio || !fim) return 0;
    const a = new Date(inicio + 'T12:00:00');
    const b = new Date(fim + 'T12:00:00');
    return Math.max(0, Math.round((b - a) / 86400000));
}
function carregarDados() {
    if (!localStorage.getItem(CHAVES.reservas)) gravar(CHAVES.reservas, [
        { id: 1, tutor: 'Cristiana da Mata', pet: 'Bob', entrada: '2026-11-10', saida: '2026-11-13', status: 'Confirmada', observacoes: 'Alimentação duas vezes ao dia.' },
        { id: 2, tutor: 'Gabrielly Xavier', pet: 'Luna', entrada: '2026-11-12', saida: '2026-11-15', status: 'Em andamento', observacoes: 'Pet tranquilo.' },
        { id: 3, tutor: 'Gabrielly Silva', pet: 'Irene', entrada: '2026-11-18', saida: '2026-11-20', status: 'Pendente', observacoes: 'Atenção à alimentação.' }
    ]);
    if (!localStorage.getItem(CHAVES.usuarios)) gravar(CHAVES.usuarios, [
        { id: 1, nome: 'Mariana Souza', email: 'mariana@email.com', telefone: '(77) 99999-1111', funcao: 'Cliente' },
        { id: 2, nome: 'Pedro Lima', email: 'pedro@email.com', telefone: '(77) 98888-2222', funcao: 'Funcionário' },
        { id: 3, nome: 'Ana Costa', email: 'ana@email.com', telefone: '(77) 97777-3333', funcao: 'Gerente' }
    ]);
    if (!localStorage.getItem(CHAVES.pets)) gravar(CHAVES.pets, [
        { id: 1, nome: 'Bob', especie: 'Cachorro', raca: 'Vira-lata', porte: 'Grande', proprietario: 'Cristiana da Mata', foto: 'bob.jpeg' },
        { id: 2, nome: 'Luna', especie: 'Gata', raca: 'Persa', porte: 'Pequeno', proprietario: 'Gabrielly Xavier', foto: 'luna.jpeg' },
        { id: 3, nome: 'Irene', especie: 'Gata', raca: 'Tricolor', porte: 'Pequeno', proprietario: 'Gabrielly Silva', foto: 'irene.jpeg' },
        { id: 4, nome: 'Bilu', especie: 'Gato', raca: 'Laranja', porte: 'Pequeno', proprietario: 'Cristiana da Mata', foto: 'bilu.jpeg' },
        { id: 5, nome: 'Trifuto', especie: 'Gato', raca: 'Preto', porte: 'Pequeno', proprietario: 'Tutor demonstrativo', foto: 'trifuto.jpeg' },
        { id: 6, nome: 'Bugin', especie: 'Cachorro', raca: 'Preto e branco', porte: 'Grande', proprietario: 'Tutor demonstrativo', foto: 'bugin.jpeg' },
        { id: 7, nome: 'Xica', especie: 'Gata', raca: 'Tricolor', porte: 'Pequeno', proprietario: 'Tutor demonstrativo', foto: 'xica.jpeg' }
    ]);
    if (!localStorage.getItem(CHAVES.config)) gravar(CHAVES.config, { diaria: 80, vagas: 30 });
}
function atualizarPainel() {
    const reservas = ler(CHAVES.reservas, []);
    const pets = ler(CHAVES.pets, []);
    const usuarios = ler(CHAVES.usuarios, []);
    const config = ler(CHAVES.config, { diaria: 80, vagas: 30 });
    const ocupadas = reservas.filter(r => r.status === 'Em andamento').length;
    const valores = { totalReservas: reservas.length, totalPets: pets.length, totalUsuarios: usuarios.length, vagasDisponiveis: Math.max(0, config.vagas - ocupadas) };
    Object.entries(valores).forEach(([id, valor]) => { const el = document.getElementById(id); if (el) el.textContent = valor; });
    const resumo = document.getElementById('resumoReservas');
    if (resumo) resumo.innerHTML = reservas.slice(0, 5).map(r => `<p><strong>#${r.id} - ${r.pet}</strong> | ${r.tutor} | ${r.status}</p>`).join('') || '<p>Nenhuma reserva cadastrada.</p>';
}
function renderReservas() {
    const corpo = document.querySelector('#tabelaReservas tbody');
    if (!corpo) return;
    const termo = (document.getElementById('buscarReserva')?.value || '').toLowerCase();
    const status = document.getElementById('filtroStatus')?.value || '';
    const reservas = ler(CHAVES.reservas, []).filter(r => `${r.id} ${r.tutor} ${r.pet} ${r.status}`.toLowerCase().includes(termo) && (!status || r.status === status));
    const diaria = ler(CHAVES.config, { diaria: 80 }).diaria;
    corpo.innerHTML = reservas.map(r => {
        const diarias = diasEntre(r.entrada, r.saida);
        return `<tr><td>${String(r.id).padStart(3, '0')}</td><td>${r.tutor}</td><td>${r.pet}</td><td>${r.entrada}</td><td>${r.saida}</td><td>${diarias}</td><td>${reais(diarias * diaria)}</td><td><span class="status">${r.status}</span></td><td class="acoes"><a href="visualizarreserva.html?id=${r.id}">Visualizar</a><a href="editarreserva.html?id=${r.id}">Editar</a><button class="btn-perigo" data-excluir-reserva="${r.id}" type="button">Excluir</button></td></tr>`;
    }).join('');
    const vazio = document.getElementById('semReservas'); if (vazio) vazio.textContent = reservas.length ? '' : 'Nenhuma reserva encontrada.';
}
function renderUsuarios() {
    const corpo = document.querySelector('#tabelaUsuarios tbody'); if (!corpo) return;
    const termo = (document.getElementById('buscarUsuario')?.value || '').toLowerCase();
    const funcao = document.getElementById('filtroFuncao')?.value || '';
    corpo.innerHTML = ler(CHAVES.usuarios, []).filter(u => `${u.nome} ${u.email} ${u.telefone}`.toLowerCase().includes(termo) && (!funcao || u.funcao === funcao)).map(u => `<tr><td>${u.nome}</td><td>${u.email}</td><td>${u.telefone}</td><td><select data-funcao-usuario="${u.id}" aria-label="Função de ${u.nome}"><option ${u.funcao === 'Gerente' ? 'selected' : ''}>Gerente</option><option ${u.funcao === 'Funcionário' ? 'selected' : ''}>Funcionário</option><option ${u.funcao === 'Cliente' ? 'selected' : ''}>Cliente</option></select></td><td><button type="button" class="btn-perigo" data-excluir-usuario="${u.id}">Excluir</button></td></tr>`).join('');
}
function renderPets() {
    const corpo = document.querySelector('#tabelaPets tbody'); if (!corpo) return;
    const termo = (document.getElementById('buscarPet')?.value || '').toLowerCase();
    corpo.innerHTML = ler(CHAVES.pets, []).filter(p => `${p.nome} ${p.especie} ${p.raca} ${p.proprietario}`.toLowerCase().includes(termo)).map(p => `<tr><td><img src="${p.foto || 'bob.jpeg'}" alt="${p.nome}" class="foto-pet-tabela"></td><td>${p.nome}</td><td>${p.especie}</td><td>${p.raca}</td><td>${p.porte}</td><td>${p.proprietario}</td><td><a href="visualizarpet.html?id=${p.id}">Visualizar</a> <button type="button" class="btn-perigo" data-excluir-pet="${p.id}">Excluir</button></td></tr>`).join('');
}
function visualizarReserva() {
    const alvo = document.getElementById('detalheReserva'); if (!alvo) return;
    const id = Number(new URLSearchParams(location.search).get('id')) || 1;
    const r = ler(CHAVES.reservas, []).find(item => item.id === id);
    if (!r) { alvo.innerHTML = '<p>Reserva não encontrada.</p>'; return; }
    const pet = ler(CHAVES.pets, []).find(p => p.nome.toLowerCase() === r.pet.toLowerCase());
    const diaria = ler(CHAVES.config, { diaria: 80 }).diaria;
    const diarias = diasEntre(r.entrada, r.saida);
    alvo.innerHTML = `<h3>Reserva #${String(r.id).padStart(3,'0')}</h3><p><strong>Status:</strong> ${r.status}</p><p><strong>Tutor:</strong> ${r.tutor}</p><p><strong>Pet:</strong> ${r.pet}</p>${pet ? `<img src="${pet.foto || 'bob.jpeg'}" alt="${pet.nome}" class="foto-pet-detalhe">` : ''}<p><strong>Entrada:</strong> ${r.entrada}</p><p><strong>Saída:</strong> ${r.saida}</p><p><strong>Diárias:</strong> ${diarias}</p><p><strong>Valor total:</strong> ${reais(diarias * diaria)}</p><p><strong>Observações:</strong> ${r.observacoes || 'Nenhuma observação.'}</p><p><a class="btn" href="editarreserva.html?id=${r.id}">Editar reserva</a></p>`;
}
function visualizarPet() {
    const alvo = document.getElementById('detalhePet'); if (!alvo) return;
    const id = Number(new URLSearchParams(location.search).get('id')) || 1;
    const pet = ler(CHAVES.pets, []).find(p => p.id === id);
    if (!pet) { alvo.innerHTML = '<p>Pet não encontrado.</p>'; return; }
    const historico = ler(CHAVES.reservas, []).filter(r => r.pet.toLowerCase() === pet.nome.toLowerCase());
    alvo.innerHTML = `<img src="${pet.foto || 'bob.jpeg'}" alt="${pet.nome}" class="foto-pet-detalhe"><h2>${pet.nome}</h2><p><strong>Espécie:</strong> ${pet.especie}</p><p><strong>Raça:</strong> ${pet.raca}</p><p><strong>Porte:</strong> ${pet.porte}</p><p><strong>Proprietário:</strong> ${pet.proprietario}</p><h3>Histórico de reservas</h3>${historico.length ? historico.map(r => `<p>Reserva #${r.id} — ${r.entrada} até ${r.saida} — ${r.status}</p>`).join('') : '<p>Não há reservas para este pet.</p>'}`;
}
function iniciarFormularios() {
    const formNova = document.getElementById('formReserva');
    if (formNova) {
        const config = ler(CHAVES.config, { diaria: 80 });
        document.getElementById('valorDiaria').textContent = reais(config.diaria);
        const calcular = () => { const total = diasEntre(document.getElementById('entrada').value, document.getElementById('saida').value) * config.diaria; document.getElementById('totalReserva').textContent = reais(total); };
        ['entrada', 'saida'].forEach(id => document.getElementById(id).addEventListener('input', calcular));
        formNova.addEventListener('submit', e => { e.preventDefault(); const lista = ler(CHAVES.reservas, []); lista.push({ id: lista.length ? Math.max(...lista.map(r => r.id)) + 1 : 1, tutor: document.getElementById('tutor').value.trim(), pet: document.getElementById('pet').value.trim(), entrada: document.getElementById('entrada').value, saida: document.getElementById('saida').value, status: document.getElementById('status').value, observacoes: document.getElementById('observacoes').value }); if (diasEntre(document.getElementById('entrada').value, document.getElementById('saida').value) < 1) return alert('A data de saída deve ser posterior à entrada.'); gravar(CHAVES.reservas, lista); alert('Reserva cadastrada com sucesso!'); location.href = 'reservas.html'; });
    }
    const formEditar = document.getElementById('formEditarReserva');
    if (formEditar) {
        const id = Number(new URLSearchParams(location.search).get('id')) || 1;
        const r = ler(CHAVES.reservas, []).find(item => item.id === id);
        if (!r) { alert('Reserva não encontrada.'); location.href = 'reservas.html'; return; }
        ['codigo', 'tutor', 'pet', 'entrada', 'saida', 'status', 'observacoes'].forEach(campo => { const el = document.getElementById(campo); if (el) el.value = campo === 'codigo' ? r.id : (r[campo] || ''); });
        const mostrarTotal = () => { const c = ler(CHAVES.config, { diaria: 80 }); document.getElementById('totalReserva').textContent = reais(diasEntre(document.getElementById('entrada').value, document.getElementById('saida').value) * c.diaria); };
        ['entrada', 'saida'].forEach(idCampo => document.getElementById(idCampo).addEventListener('input', mostrarTotal)); mostrarTotal();
        formEditar.addEventListener('submit', e => { e.preventDefault(); if (diasEntre(document.getElementById('entrada').value, document.getElementById('saida').value) < 1) return alert('A data de saída deve ser posterior à entrada.'); const lista = ler(CHAVES.reservas, []); const pos = lista.findIndex(item => item.id === id); lista[pos] = { ...lista[pos], tutor: document.getElementById('tutor').value, pet: document.getElementById('pet').value, entrada: document.getElementById('entrada').value, saida: document.getElementById('saida').value, status: document.getElementById('status').value, observacoes: document.getElementById('observacoes').value }; gravar(CHAVES.reservas, lista); alert('Reserva atualizada!'); location.href = 'reservas.html'; });
    }
    const formPet = document.getElementById('formPet');
    if (formPet) formPet.addEventListener('submit', e => { e.preventDefault(); const salvarPet = foto => { const lista = ler(CHAVES.pets, []); lista.push({ id: lista.length ? Math.max(...lista.map(p => p.id)) + 1 : 1, nome: document.getElementById('nome').value, especie: document.getElementById('especie').value, raca: document.getElementById('raca').value, porte: document.getElementById('porte').value, proprietario: document.getElementById('proprietario').value, foto: foto || 'bob.jpeg' }); gravar(CHAVES.pets, lista); alert('Pet cadastrado!'); location.href = 'pets.html'; }; const arquivo = document.getElementById('fotoPet')?.files[0]; if (arquivo) { const leitor = new FileReader(); leitor.onload = () => salvarPet(leitor.result); leitor.readAsDataURL(arquivo); } else salvarPet('bob.jpeg'); });
    const formConfig = document.getElementById('formConfiguracoes');
    if (formConfig) { const c = ler(CHAVES.config, { diaria: 80, vagas: 30 }); document.getElementById('diaria').value = c.diaria; document.getElementById('vagas').value = c.vagas; formConfig.addEventListener('submit', e => { e.preventDefault(); gravar(CHAVES.config, { diaria: Number(document.getElementById('diaria').value), vagas: Number(document.getElementById('vagas').value) }); const msg = document.getElementById('mensagemConfig'); msg.hidden = false; msg.textContent = 'Configurações salvas neste navegador!'; atualizarPainel(); }); }
    const login = document.getElementById('formLogin'); if (login) login.addEventListener('submit', e => { e.preventDefault(); location.href = 'dashboard.html'; });
}
document.addEventListener('DOMContentLoaded', () => {
    carregarDados(); atualizarPainel(); renderReservas(); renderUsuarios(); renderPets(); visualizarPet(); visualizarReserva(); iniciarFormularios();
    document.getElementById('buscarReserva')?.addEventListener('input', renderReservas);
    document.getElementById('filtroStatus')?.addEventListener('change', renderReservas);
    document.getElementById('buscarUsuario')?.addEventListener('input', renderUsuarios);
    document.getElementById('filtroFuncao')?.addEventListener('change', renderUsuarios);
    document.getElementById('buscarPet')?.addEventListener('input', renderPets);
    document.addEventListener('change', e => { if (e.target.matches('[data-funcao-usuario]')) { const lista = ler(CHAVES.usuarios, []); const u = lista.find(item => item.id === Number(e.target.dataset.funcaoUsuario)); if (u) { u.funcao = e.target.value; gravar(CHAVES.usuarios, lista); alert('Função do usuário atualizada!'); } } });
    document.addEventListener('click', e => {
        const idReserva = e.target.dataset.excluirReserva; if (idReserva && confirm('Deseja excluir esta reserva?')) { gravar(CHAVES.reservas, ler(CHAVES.reservas, []).filter(r => r.id !== Number(idReserva))); renderReservas(); atualizarPainel(); }
        const idUsuario = e.target.dataset.excluirUsuario; if (idUsuario && confirm('Deseja excluir este usuário?')) { gravar(CHAVES.usuarios, ler(CHAVES.usuarios, []).filter(u => u.id !== Number(idUsuario))); renderUsuarios(); atualizarPainel(); }
        const idPet = e.target.dataset.excluirPet; if (idPet && confirm('Deseja excluir este pet?')) { gravar(CHAVES.pets, ler(CHAVES.pets, []).filter(p => p.id !== Number(idPet))); renderPets(); atualizarPainel(); }
    });
});

// Seleção dos elementos DOM
const tarefaInput = document.getElementById('tarefa');
const adicionarBtn = document.getElementById('adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorEl = document.getElementById('contador');
const limparBtn = document.getElementById('limpar');
const filtros = document.querySelectorAll('.filtro');

// Estado inicial da aplicação
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let filtroAtual = 'todos';

// Função para salvar tarefas no localStorage
function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Função para criar elemento de tarefa
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.className = `tarefa-item ${tarefa.concluida ? 'concluida' : ''}`;
    li.dataset.id = tarefa.id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = tarefa.concluida;
    
    const span = document.createElement('span');
    span.className = 'tarefa-texto';
    span.textContent = tarefa.texto;
    
    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'excluir';
    btnExcluir.textContent = '×';
    
    li.append(checkbox, span, btnExcluir);
    
    return li;
}

// Função para renderizar a lista de tarefas
function renderizarTarefas() {
    listaTarefas.innerHTML = '';
    
    const tarefasFiltradas = filtrarTarefas();
    
    if (tarefasFiltradas.length === 0) {
        const mensagem = document.createElement('li');
        mensagem.className = 'tarefa-item mensagem';
        mensagem.textContent = 'Nenhuma tarefa encontrada';
        listaTarefas.appendChild(mensagem);
    } else {
        tarefasFiltradas.forEach(tarefa => {
            const elementoTarefa = criarElementoTarefa(tarefa);
            listaTarefas.appendChild(elementoTarefa);
        });
    }
    
    atualizarContador();
}

// Função para filtrar tarefas
function filtrarTarefas() {
    switch (filtroAtual) {
        case 'pendentes':
            return tarefas.filter(tarefa => !tarefa.concluida);
        case 'concluidos':
            return tarefas.filter(tarefa => tarefa.concluida);
        default:
            return tarefas;
    }
}

// Função para atualizar o contador
function atualizarContador() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;
    
    contadorEl.textContent = total === 1 
        ? '1 tarefa' 
        : `${total} tarefas`;
        
    if (total > 0) {
        contadorEl.textContent += ` (${concluidas} concluídas)`;
    }
}

// Adicionar uma nova tarefa
function adicionarTarefa() {
    const texto = tarefaInput.value.trim();
    
    if (!texto) return;
    
    const novaTarefa = {
        id: Date.now(),
        texto,
        concluida: false
    };
    
    tarefas.push(novaTarefa);
    salvarTarefas();
    renderizarTarefas();
    
    tarefaInput.value = '';
    tarefaInput.focus();
}

// Eventos para adicionar tarefa
adicionarBtn.addEventListener('click', adicionarTarefa);
tarefaInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});

// Eventos de clique na lista (delegação de eventos)
listaTarefas.addEventListener('click', e => {
    const itemTarefa = e.target.closest('.tarefa-item');
    if (!itemTarefa) return;
    
    const id = parseInt(itemTarefa.dataset.id);
    
    // Alternar status de conclusão
    if (e.target.className === 'checkbox') {
        tarefas = tarefas.map(tarefa => 
            tarefa.id === id ? {...tarefa, concluida: !tarefa.concluida} : tarefa
        );
        salvarTarefas();
        renderizarTarefas();
    }
    
    // Excluir tarefa
    if (e.target.className === 'excluir') {
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        salvarTarefas();
        renderizarTarefas();
    }
});

// Limpar tarefas concluídas
limparBtn.addEventListener('click', () => {
    const hasConcluidas = tarefas.some(tarefa => tarefa.concluida);
    
    if (!hasConcluidas) return;
    
    if (confirm('Tem certeza que deseja remover todas as tarefas concluídas?')) {
        tarefas = tarefas.filter(tarefa => !tarefa.concluida);
        salvarTarefas();
        renderizarTarefas();
    }
});

// Configurar filtros
filtros.forEach(btn => {
    btn.addEventListener('click', () => {
        filtros.forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        
        filtroAtual = btn.dataset.filtro;
        renderizarTarefas();
    });
});

// Inicializar aplicação
renderizarTarefas();
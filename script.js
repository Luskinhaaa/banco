document.addEventListener('DOMContentLoaded', () => {
    let players = [];

    // Função para atualizar a lista de jogadores
    function updatePlayerList() {
        const playerListDiv = document.getElementById('playerList');
        const playerOptions = document.querySelectorAll('select');

        playerListDiv.innerHTML = players.map((p, index) => 
            `<p class="player" onclick="showPlayerHistory(${index})">${p.name}: R$ ${p.balance}</p>`
        ).join('');

        playerOptions.forEach(select => {
            const playerSelectOptions = players.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
            select.innerHTML = `<option value="" disabled selected>Selecionar Jogador</option>${playerSelectOptions}`;
        });
    }

    // Função para mostrar notificação
    function showNotification(message) {
        const notificationDiv = document.getElementById('notification');
        notificationDiv.textContent = message;
        notificationDiv.style.display = 'block'; // Mostra a notificação
    
        // Esconde a notificação após 2 segundos
        setTimeout(() => {
            notificationDiv.style.display = 'none'; // Esconde a notificação
        }, 2000); // 2000 milissegundos = 2 segundos
    }

    // Adiciona jogador
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => {
            const playerName = document.getElementById('playerName').value.trim();
            if (playerName && players.length < 6) {
                players.push({ name: playerName, balance: 20000, history: [] });
                updatePlayerList();
                document.getElementById('playerName').value = ''; // Limpa o campo
                closeModal(); // Fecha a modal após adicionar jogador
            } else if (players.length >= 6) {
                alert('Máximo de 6 jogadores permitido');
            }
        });
    }

    // Mostrar histórico do jogador por 3 segundos
    window.showPlayerHistory = (index) => {
        const player = players[index];
        const historyDisplay = document.getElementById('historyDisplay');
        const historyPlayerName = document.getElementById('historyPlayerName');

        historyPlayerName.textContent = player.name;
        historyDisplay.innerHTML = player.history.length > 0 ? player.history.map(entry => 
            `<p>${entry.action}: R$ ${entry.amount} às ${entry.time}</p>`
        ).join('') : '<p>Nenhuma transação registrada.</p>';

        // Mostrar histórico
        const playerHistory = document.getElementById('playerHistory');
        playerHistory.style.display = 'block';

        // Esconder o histórico após 3 segundos
        setTimeout(() => {
            playerHistory.style.display = 'none';
        }, 5000); // 5000 milissegundos = 5 segundos
    };

    // Adicionar dinheiro
    const addMoneyBtn = document.getElementById('addMoneyBtn');
    if (addMoneyBtn) {
        addMoneyBtn.addEventListener('click', () => {
            const managePlayer = document.getElementById('managePlayer').value;
            const amount = parseInt(document.getElementById('addMoneyAmount').value);

            if (managePlayer && amount > 0) {
                const player = players.find(p => p.name === managePlayer);
                player.balance += amount;
                player.history.push({ action: '↪️ 𝘼𝙙𝙞𝙘𝙞𝙤𝙣𝙖𝙙𝙤 ', amount: amount, time: new Date().toLocaleString() });
                updatePlayerList();
                document.getElementById('addMoneyAmount').value = ''; // Limpa o campo
            } else {
                alert('Por favor, insira um valor válido.');
            }
        });
    }

    // Subtrair dinheiro
    const subtractMoneyBtn = document.getElementById('subtractMoneyBtn');
    if (subtractMoneyBtn) {
        subtractMoneyBtn.addEventListener('click', () => {
            const managePlayer = document.getElementById('managePlayer').value;
            const amount = parseInt(document.getElementById('addMoneyAmount').value);

            if (managePlayer && amount > 0) {
                const player = players.find(p => p.name === managePlayer);
                if (player.balance >= amount) {
                    player.balance -= amount;
                    player.history.push({ action: '❗ 𝙍𝙚𝙩𝙞𝙧𝙖𝙙𝙤', amount: amount, time: new Date().toLocaleString() });
                    updatePlayerList();
                    document.getElementById('addMoneyAmount').value = ''; // Limpa o campo
                } else {
                    alert('Saldo insuficiente.');
                }
            } else {
                alert('Por favor, insira um valor válido.');
            }
        });
    }

    // Transferir dinheiro
    const transferBtn = document.getElementById('transferBtn');
    if (transferBtn) {
        transferBtn.addEventListener('click', () => {
            const fromPlayer = document.getElementById('fromPlayer').value;
            const toPlayer = document.getElementById('toPlayer').value;
            const amount = parseInt(document.getElementById('amount').value);

            if (fromPlayer && toPlayer && amount > 0) {
                const sender = players.find(p => p.name === fromPlayer);
                const receiver = players.find(p => p.name === toPlayer);

                if (sender.balance >= amount) {
                    if (amount > 2000) {
                        const confirmTransfer = confirm(`Deseja mesmo transferir R$ ${amount} de ${fromPlayer} para ${toPlayer}. Quer continuar?\n🛂 PROCEDIMENTO DE SEGURANÇA 🔒`);
                        if (!confirmTransfer) return; // Cancela a transferência se o usuário não confirmar
                    }

                    sender.balance -= amount;
                    receiver.balance += amount;

                    sender.history.push({ action: '➡️ 𝘛𝘳𝘢𝘯𝘴𝘧𝘦𝘳𝘪𝘥𝘰 𝘱𝘢𝘳𝘢 ' + toPlayer, amount: amount, time: new Date().toLocaleString() });
                    receiver.history.push({ action: '☑️ 𝘙𝘦𝘤𝘦𝘣𝘪𝘥𝘰 𝘥𝘦 ' + fromPlayer, amount: amount, time: new Date().toLocaleString() });

                    updatePlayerList();
                    document.getElementById('amount').value = ''; // Limpa o campo
                    showNotification('Transferência realizada com sucesso! 🤑'); // Mostra notificação
                } else {
                    alert('Saldo insuficiente para a transferência.');
                }
            } else {
                alert('Por favor, preencha todos os campos corretamente.');
            }
        });
    }

    // Mostrar modal
    function showModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';
    }

    // Fechar modal
    function closeModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
    }

    // Evento para abrir modal ao clicar no botão "Adicionar Jogador"
    document.getElementById('openModalBtn').addEventListener('click', showModal);

    // Evento para fechar a modal ao clicar no botão "Fechar" da modal
    document.querySelector('.close').addEventListener('click', closeModal);

    // Fechar a modal ao clicar fora dela
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('myModal');
        if (event.target == modal) {
            closeModal();
        }
    });
});

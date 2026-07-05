// ==============================================
// পপ-আপ UI (ব্যালেন্স + ট্রানজেকশন লিস্ট সহ)
// ==============================================
function createDashboardPopup() {
    const existing = document.getElementById('customPopup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'customPopup';
    popup.style.cssText = 'position:fixed;top:5%;left:50%;transform:translateX(-50%);background:#1e272e;color:#fff;padding:20px;border-radius:10px;z-index:99999;width:400px;max-height:90vh;overflow-y:auto;box-shadow:0 0 20px rgba(0,0,0,0.9);font-family:Arial,sans-serif;';
    
    popup.innerHTML = `
        <h2 style="text-align:center;color:#f1c40f;margin:0 0 10px 0;">👑 SL TECH BD</h2>
        
        <div style="background:#2d3436;padding:12px;border-radius:5px;margin-bottom:10px;text-align:center;border:1px solid #f1c40f;">
            <span style="font-size:14px;color:#b2bec3;">💰 লাইভ ব্যালেন্স</span><br>
            <span id="balanceAmount" style="font-size:28px;font-weight:bold;color:#2ecc71;">$0.00</span>
        </div>

        <h3 style="margin:10px 0 5px 0;color:#dfe6e9;">🏆 লিডারবোর্ড</h3>
        <div class="leaderboard" style="background:#2d3436;padding:8px;border-radius:5px;font-size:14px;">
            <p style="margin:2px 0;">1. Alamin - লাভ: $1,250 <span class="profit-amount" style="color:#2ecc71;">+12%</span></p>
            <p style="margin:2px 0;">2. Rakib - লাভ: $980 <span class="profit-amount" style="color:#2ecc71;">+8%</span></p>
            <p style="margin:2px 0;">3. Sumon - লোকসান: $200 <span class="profit-amount" style="color:#e74c3c;">-5%</span></p>
        </div>

        <h3 style="margin:10px 0 5px 0;color:#dfe6e9;">📜 ট্রানজেকশন হিস্টোরি</h3>
        <div id="txList" style="max-height:150px;overflow-y:auto;background:#2d3436;padding:5px;border-radius:5px;font-size:12px;min-height:40px;color:#b2bec3;">
            এখনো কোনো ট্রানজেকশন নেই
        </div>

        <button id="addTxBtn" style="background:#3498db;color:#fff;border:none;padding:10px;border-radius:5px;cursor:pointer;width:100%;font-size:16px;margin-top:10px;">➕ ট্রানজেকশন যোগ করুন</button>
        <div id="txForm" style="display:none;margin-top:10px;">
            <select id="methodSelect" style="width:100%;padding:8px;margin-bottom:5px;border-radius:5px;">
                <option>Bkash (P2C)</option><option>Nagad (P2C)</option>
                <option>Bitcoin (BTC)</option><option>USDT (BEP-20)</option>
            </select>
            <input id="amountInput" placeholder="টাকার পরিমাণ (শুধু নাম্বার)" style="width:100%;padding:8px;margin-bottom:5px;box-sizing:border-box;border-radius:5px;">
            <button id="submitTx" style="background:#2ecc71;color:#fff;border:none;padding:10px;border-radius:5px;cursor:pointer;width:100%;font-size:16px;">জমা দিন</button>
        </div>
        <button id="closePopupBtn" style="background:#e74c3c;color:#fff;border:none;padding:5px;border-radius:5px;cursor:pointer;width:100%;margin-top:10px;">✖ বন্ধ করুন</button>
    `;
    document.body.appendChild(popup);

    document.getElementById('addTxBtn').addEventListener('click', function() {
        document.getElementById('txForm').style.display = 'block';
    });
    document.getElementById('submitTx').addEventListener('click', addTransaction);
    document.getElementById('closePopupBtn').addEventListener('click', function() {
        document.getElementById('customPopup').remove();
    });

    renderTransactions(); // লিস্ট ও ব্যালেন্স দেখাও
}

// ==============================================
// ট্রানজেকশন যোগ করা (লোকাল স্টোরেজে)
// ==============================================
function addTransaction() {
    const method = document.getElementById('methodSelect').value;
    const amountInput = document.getElementById('amountInput');
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('দয়া করে ০ এর বেশি টাকা লিখুন!');
        return;
    }

    const profit = (Math.random() * 10 + 2).toFixed(2);
    const txData = {
        id: Date.now(),
        type: 'Deposit',
        method: method,
        amount: amount,
        profit: profit + '%',
        status: '✅ Success'
    };

    let allTxs = JSON.parse(localStorage.getItem('transactions')) || [];
    allTxs.push(txData);
    localStorage.setItem('transactions', JSON.stringify(allTxs));
    
    alert('✅ টাকা জমা হয়েছে!');
    amountInput.value = '';
    document.getElementById('txForm').style.display = 'none';
    renderTransactions(); // সঙ্গে সঙ্গে আপডেট
}

// ==============================================
// UI আপডেট (ব্যালেন্স + লিস্ট)
// ==============================================
function renderTransactions() {
    const allTxs = JSON.parse(localStorage.getItem('transactions')) || [];
    const listContainer = document.getElementById('txList');
    const balanceEl = document.getElementById('balanceAmount');
    if (!listContainer) return;

    if (allTxs.length === 0) {
        listContainer.innerHTML = 'এখনো কোনো ট্রানজেকশন নেই';
        if (balanceEl) balanceEl.innerText = '$0.00';
        return;
    }

    let html = '';
    let totalBalance = 0;
    const reversed = [...allTxs].reverse();
    reversed.forEach(tx => {
        totalBalance += tx.amount;
        html += `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #3d3d3d;color:#dfe6e9;">
            <span>${tx.method}</span>
            <span style="color:#2ecc71;">+$${tx.amount.toFixed(2)}</span>
            <span style="color:#f1c40f;">${tx.profit}</span>
            <span style="color:#00b894;">${tx.status}</span>
        </div>`;
    });
    if (balanceEl) balanceEl.innerText = '$' + totalBalance.toFixed(2);
    listContainer.innerHTML = html;
}

// ==============================================
// লাভ/লোকসানের রঙ আপডেট (ঐচ্ছিক)
// ==============================================
function updateBalanceUI() {
    document.querySelectorAll('.profit-amount').forEach(el => {
        if (el.innerText.includes('+')) el.style.color = '#2ecc71';
        else if (el.innerText.includes('-')) el.style.color = '#e74c3c';
    });
}

// ==============================================
// ★ ইনিশিয়ালাইজ (যেকোনো অবস্থায় কাজ করবে)
// ==============================================
function initApp() {
    createDashboardPopup();
    setInterval(updateBalanceUI, 3000);
}

// পেজ লোড হওয়ার আগে বা পরে যেকোনো সময় চালু হবে
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

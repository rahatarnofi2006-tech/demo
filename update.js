// ==============================================
// মেইন UI তৈরি করা (ড্যাশবোর্ড পপ-আপ) - কোনো লাইসেন্স চেক নেই
// ==============================================
function createDashboardPopup() {
    // আগে যদি popup থাকে, তাহলে ডিলিট করে নতুন বানাবো (ডুপ্লিকেট ঠেকাতে)
    const existing = document.getElementById('customPopup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'customPopup';
    popup.style.cssText = 'position:fixed;top:10%;left:50%;transform:translateX(-50%);background:#1e272e;color:#fff;padding:20px;border-radius:10px;z-index:99999;width:400px;box-shadow:0 0 20px rgba(0,0,0,0.8);font-family:Arial,sans-serif;';
    popup.innerHTML = `
        <h2 style="text-align:center;color:#f1c40f;">👑 SL TECH BD - লাইভ ট্রেডিং</h2>
        <hr>
        <h3>🏆 লিডারবোর্ড (ফেক ডেটা)</h3>
        <div class="leaderboard" style="background:#2d3436;padding:10px;border-radius:5px;">
            <p>1. Alamin Hossain - লাভ: $1,250 <span class="profit-amount" style="color:#2ecc71;">+12%</span></p>
            <p>2. Rakib Hasan - লাভ: $980 <span class="profit-amount" style="color:#2ecc71;">+8%</span></p>
            <p>3. Sumon Mia - লোকসান: $200 <span class="profit-amount" style="color:#e74c3c;">-5%</span></p>
        </div>
        <hr>
        <button id="addTxBtn" style="background:#3498db;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;width:100%;font-size:16px;">➕ ট্রানজেকশন যোগ করুন</button>
        <div id="txForm" style="display:none;margin-top:10px;">
            <select id="methodSelect" style="width:100%;padding:8px;margin-bottom:5px;border-radius:5px;">
                <option>Bkash (P2C)</option>
                <option>Nagad (P2C)</option>
                <option>Bitcoin (BTC)</option>
                <option>USDT (BEP-20)</option>
            </select>
            <input id="amountInput" placeholder="টাকার পরিমাণ (শুধু নাম্বার)" style="width:100%;padding:8px;margin-bottom:5px;box-sizing:border-box;border-radius:5px;">
            <button id="submitTx" style="background:#2ecc71;color:#fff;border:none;padding:10px;border-radius:5px;cursor:pointer;width:100%;font-size:16px;">জমা দিন</button>
        </div>
        <p style="font-size:11px;color:#95a5a6;text-align:center;margin-top:10px;">⚠️ ডেটা লোকাল স্টোরেজে সেভ হয় (শুধু আপনার ব্রাউজারে)</p>
        <button id="closePopupBtn" style="background:#e74c3c;color:#fff;border:none;padding:5px;border-radius:5px;cursor:pointer;width:100%;margin-top:5px;">✖ বন্ধ করুন</button>
    `;
    document.body.appendChild(popup);

    // ইভেন্ট লিসেনার যোগ করুন (প্রতিবার নতুন করে যোগ হচ্ছে)
    document.getElementById('addTxBtn').addEventListener('click', function() {
        document.getElementById('txForm').style.display = 'block';
    });
    document.getElementById('submitTx').addEventListener('click', addTransaction);
    document.getElementById('closePopupBtn').addEventListener('click', function() {
        document.getElementById('customPopup').remove();
    });
}

// ==============================================
// ফেক ট্রানজেকশন যোগ করা
// ==============================================
function addTransaction() {
    const method = document.getElementById('methodSelect').value;
    const amountInput = document.getElementById('amountInput');
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('দয়া করে ০ এর বেশি টাকার পরিমাণ লিখুন!');
        return;
    }

    const profit = (Math.random() * 10 + 2).toFixed(2);
    const txData = {
        id: Date.now(),
        type: 'Deposit',
        method: method,
        amount: amount,
        profit: profit + '%',
        status: 'Successed'
    };

    let allTxs = JSON.parse(localStorage.getItem('transactions')) || [];
    allTxs.push(txData);
    localStorage.setItem('transactions', JSON.stringify(allTxs));
    
    alert('✅ টাকা জমা হয়েছে! লোকাল স্টোরেজে সেভ করা হয়েছে।');
    amountInput.value = '';
    document.getElementById('txForm').style.display = 'none';
}

// ==============================================
// লাভ/লোকসানের রঙ আপডেট
// ==============================================
function updateBalanceUI() {
    document.querySelectorAll('.profit-amount').forEach(el => {
        if (el.innerText.includes('+')) {
            el.style.color = '#2ecc71';
        } else if (el.innerText.includes('-')) {
            el.style.color = '#e74c3c';
        }
    });
}

// ==============================================
// ★★★ সবচেয়ে গুরুত্বপূর্ণ: পেজ লোড হওয়ার পরেও যেন কাজ করে ★★★
// ==============================================
function initializeApp() {
    createDashboardPopup();
    setInterval(updateBalanceUI, 3000);
}

// পেজ লোড হওয়ার আগে বা পরে, যেকোনো অবস্থায় চালু হবে
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // পেজ আগেই লোড হয়ে গেলে ডাইরেক্ট চালু করো
    initializeApp();
}

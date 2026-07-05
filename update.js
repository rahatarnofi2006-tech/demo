// ==============================================
// SL TECH BD - কোয়োটেক্স লাইভ ড্যাশবোর্ড (লাইসেন্স ফ্রি)
// সম্পূর্ণ আসল স্ক্রিপ্টের মতো, শুধু লাইসেন্স চেক বাদ
// ==============================================

(function() {
    'use strict';

    // ---------- কনফিগারেশন ----------
    const STORAGE_KEY = '__sl_tech_data';
    const TRANSACTIONS_KEY = '__sl_transactions';

    // ---------- ডেটা ম্যানেজমেন্ট ----------
    function getBalance() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return parseFloat(data.balance) || 0;
        } catch { return 0; }
    }

    function setBalance(amount) {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        data.balance = amount;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getTransactions() {
        try {
            return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
        } catch { return []; }
    }

    function saveTransactions(txs) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
    }

    function formatMoney(amount) {
        return '$' + amount.toFixed(2);
    }

    // ---------- UI তৈরি (আসল স্ক্রিপ্টের মতো) ----------
    function createDashboardPopup() {
        // আগের পপ-আপ থাকলে রিমুভ
        const old = document.getElementById('slTechPopup');
        if (old) old.remove();

        const popup = document.createElement('div');
        popup.id = 'slTechPopup';
        Object.assign(popup.style, {
            position: 'fixed',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1e272e',
            color: '#fff',
            padding: '20px',
            borderRadius: '12px',
            zIndex: '999999',
            width: '420px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            border: '1px solid #333'
        });

        // হেডার
        popup.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;padding-bottom:10px;">
                <h2 style="margin:0;color:#f1c40f;font-size:20px;">👑 SL TECH BD</h2>
                <button id="closeSlPopup" style="background:#e74c3c;border:none;color:#fff;padding:4px 12px;border-radius:6px;cursor:pointer;">✕</button>
            </div>

            <!-- লাইভ ব্যালেন্স (Quotex এর সাথে ইন্টিগ্রেটেড) -->
            <div style="background:#2d3436;padding:12px;border-radius:8px;margin:12px 0;text-align:center;border:1px solid #f1c40f;">
                <span style="font-size:13px;color:#b2bec3;">💰 লাইভ ব্যালেন্স</span><br>
                <span id="slBalanceDisplay" style="font-size:28px;font-weight:bold;color:#2ecc71;">${formatMoney(getBalance())}</span>
            </div>

            <!-- লিডারবোর্ড (ফেক) -->
            <h3 style="margin:8px 0 4px 0;color:#dfe6e9;font-size:15px;">🏆 লিডারবোর্ড</h3>
            <div style="background:#2d3436;padding:8px 12px;border-radius:6px;font-size:13px;margin-bottom:10px;">
                <p style="margin:2px 0;">1. Alamin - লাভ: $1,250 <span class="sl-profit" style="color:#2ecc71;">+12%</span></p>
                <p style="margin:2px 0;">2. Rakib - লাভ: $980 <span class="sl-profit" style="color:#2ecc71;">+8%</span></p>
                <p style="margin:2px 0;">3. Sumon - লোকসান: $200 <span class="sl-profit" style="color:#e74c3c;">-5%</span></p>
            </div>

            <!-- ট্রানজেকশন হিস্টোরি -->
            <h3 style="margin:8px 0 4px 0;color:#dfe6e9;font-size:15px;">📜 ট্রানজেকশন হিস্টোরি</h3>
            <div id="slTxList" style="max-height:140px;overflow-y:auto;background:#2d3436;padding:5px 8px;border-radius:6px;font-size:12px;min-height:35px;color:#b2bec3;margin-bottom:10px;">
                এখনো কোনো ট্রানজেকশন নেই
            </div>

            <!-- বাটন ও ফর্ম -->
            <button id="slAddTxBtn" style="background:#3498db;color:#fff;border:none;padding:10px;border-radius:6px;cursor:pointer;width:100%;font-size:15px;font-weight:bold;">➕ ট্রানজেকশন যোগ করুন</button>
            
            <div id="slTxForm" style="display:none;margin-top:10px;">
                <select id="slMethodSelect" style="width:100%;padding:8px;border-radius:6px;background:#2d3436;color:#fff;border:1px solid #555;margin-bottom:6px;">
                    <option>Bkash (P2C)</option>
                    <option>Nagad (P2C)</option>
                    <option>Bitcoin (BTC)</option>
                    <option>USDT (BEP-20)</option>
                </select>
                <input id="slAmountInput" placeholder="টাকার পরিমাণ (শুধু নাম্বার)" style="width:100%;padding:8px;border-radius:6px;background:#2d3436;color:#fff;border:1px solid #555;box-sizing:border-box;margin-bottom:6px;" type="number" step="0.01">
                <button id="slSubmitTx" style="background:#2ecc71;color:#fff;border:none;padding:10px;border-radius:6px;cursor:pointer;width:100%;font-size:15px;font-weight:bold;">জমা দিন</button>
            </div>
        `;

        document.body.appendChild(popup);

        // ---------- ইভেন্ট লিসেনার ----------
        document.getElementById('closeSlPopup').addEventListener('click', () => popup.remove());

        document.getElementById('slAddTxBtn').addEventListener('click', () => {
            document.getElementById('slTxForm').style.display = 'block';
        });

        document.getElementById('slSubmitTx').addEventListener('click', function() {
            const method = document.getElementById('slMethodSelect').value;
            const input = document.getElementById('slAmountInput');
            const amount = parseFloat(input.value);

            if (isNaN(amount) || amount <= 0) {
                alert('দয়া করে ০ এর বেশি টাকা লিখুন!');
                return;
            }

            const profit = (Math.random() * 10 + 2).toFixed(2);
            const tx = {
                id: Date.now(),
                method: method,
                amount: amount,
                profit: profit + '%',
                status: '✅ Success',
                time: new Date().toLocaleTimeString()
            };

            const txs = getTransactions();
            txs.push(tx);
            saveTransactions(txs);

            // ব্যালেন্স আপডেট
            const currentBalance = getBalance();
            setBalance(currentBalance + amount);

            alert('✅ টাকা জমা হয়েছে! ব্যালেন্স আপডেট হয়েছে।');
            input.value = '';
            document.getElementById('slTxForm').style.display = 'none';

            // UI ও কোয়োটেক্স আপডেট
            updateAllUI();
        });

        // শুরুতে UI লোড
        updateAllUI();
    }

    // ---------- Quotex-এ ইনজেক্ট করা (আসল স্ক্রিপ্টের মতো) ----------
    function injectIntoQuotex() {
        const balance = getBalance();
        const formatted = formatMoney(balance);

        // আসল ওবফাস্কেটেড স্ক্রিপ্টে যেসব সিলেক্টর ব্যবহার করত
        const selectors = [
            '.usermenuBalance', 
            '.positionHeaderMoney', 
            '.levelProfit',
            '.header-balance',
            '[class*="balance"]'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el && el.innerText && el.innerText.includes('$')) {
                    el.innerText = formatted;
                }
            });
        });

        // ইউজারনেম আপডেট (যদি থাকে)
        const nameEl = document.querySelector('.usermenuName, .levelName, [class*="username"]');
        if (nameEl) {
            nameEl.innerText = 'SL_TECH_BD';
        }
    }

    // ---------- ট্রানজেকশন লিস্ট রেন্ডার ----------
    function renderTransactionList() {
        const container = document.getElementById('slTxList');
        const balanceEl = document.getElementById('slBalanceDisplay');
        if (!container) return;

        const txs = getTransactions();
        const balance = getBalance();

        if (balanceEl) balanceEl.innerText = formatMoney(balance);

        if (txs.length === 0) {
            container.innerHTML = 'এখনো কোনো ট্রানজেকশন নেই';
            return;
        }

        let html = '';
        const reversed = [...txs].reverse();
        reversed.forEach(tx => {
            html += `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #3d3d3d;color:#dfe6e9;">
                <span style="font-size:11px;">${tx.method}</span>
                <span style="color:#2ecc71;font-weight:bold;">+$${tx.amount.toFixed(2)}</span>
                <span style="color:#f1c40f;font-size:11px;">${tx.profit}</span>
                <span style="color:#00b894;font-size:11px;">${tx.status}</span>
            </div>`;
        });
        container.innerHTML = html;
    }

    // ---------- সব UI আপডেট (পপ-আপ + Quotex) ----------
    function updateAllUI() {
        renderTransactionList();
        injectIntoQuotex();
        
        // লাভ/লোকসানের রঙ আপডেট
        document.querySelectorAll('.sl-profit').forEach(el => {
            if (el.innerText.includes('+')) el.style.color = '#2ecc71';
            else if (el.innerText.includes('-')) el.style.color = '#e74c3c';
        });
    }

    // ---------- MutationObserver (Quotex DOM পরিবর্তন ধরতে) ----------
    function startObserver() {
        const targetNode = document.body;
        if (!targetNode) return;

        const observer = new MutationObserver(() => {
            injectIntoQuotex();
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // ---------- ইনিশিয়ালাইজ (লাইসেন্স চেক সম্পূর্ণ বাদ) ----------
    function init() {
        createDashboardPopup();
        startObserver();
        setInterval(updateAllUI, 3000); // প্রতি ৩ সেকেন্ডে আপডেট
        console.log('✅ SL TECH BD লাইসেন্স-ফ্রি ভার্সন চালু হয়েছে!');
    }

    // পেজ লোডের অবস্থা চেক
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

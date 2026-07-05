// ==============================================
// মেইন UI তৈরি করা (ড্যাশবোর্ড পপ-আপ)
// ==============================================
function createDashboardPopup() {
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
        <button id="addTxBtn" style="background:#3498db;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;width:100%;">➕ ট্রানজেকশন যোগ করুন</button>
        <div id="txForm" style="display:none;margin-top:10px;">
            <select id="methodSelect" style="width:100%;padding:8px;margin-bottom:5px;">
                <option>Bkash (P2C)</option>
                <option>Nagad (P2C)</option>
                <option>Bitcoin (BTC)</option>
                <option>USDT (BEP-20)</option>
            </select>
            <input id="amountInput" placeholder="টাকার পরিমাণ" style="width:100%;padding:8px;margin-bottom:5px;box-sizing:border-box;">
            <button id="submitTx" style="background:#2ecc71;color:#fff;border:none;padding:10px;border-radius:5px;cursor:pointer;width:100%;">জমা দিন</button>
        </div>
        <p style="font-size:12px;color:#95a5a6;text-align:center;margin-top:10px;">ডেটা লোকাল স্টোরেজে সেভ হয় (শুধুমাত্র আপনার ব্রাউজারে)</p>
    `;
    document.body.appendChild(popup);
}

// ==============================================
// ফেক ট্রানজেকশন যোগ করা এবং লোকাল স্টোরেজে সেভ করা
// ==============================================
function addTransaction() {
    const method = document.getElementById('methodSelect').value;
    const amountInput = document.getElementById('amountInput');
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('দয়া করে সঠিক টাকার পরিমাণ দিন!');
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
    
    alert('✅ টাকা জমা হয়েছে! কিন্তু মনে রাখবেন, এই টাকা আসলে কোথাও যায় না, শুধু আপনার ব্রাউজারে দেখায়!');
    amountInput.value = '';
    document.getElementById('txForm').style.display = 'none';
}

// ==============================================
// লাভ/লোকসানের রঙ পরিবর্তন করা (লাল/সবুজ)
// ==============================================
function updateBalanceUI() {
    document.querySelectorAll('.profit-amount').forEach(el => {
        let text = el.innerText.replace('+', '').replace('-', '').replace('%', '');
        let value = parseFloat(text);
        if (!isNaN(value)) {
            if (el.innerText.includes('+')) {
                el.style.color = '#2ecc71'; // সবুজ
            } else {
                el.style.color = '#e74c3c'; // লাল
            }
        }
    });
}

// ==============================================
// সবকিছু চালু করার জন্য ইভেন্ট লিসেনার (লাইসেন্স চেক বাদ দেওয়া হয়েছে)
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    createDashboardPopup();
    
    document.getElementById('addTxBtn').addEventListener('click', function() {
        document.getElementById('txForm').style.display = 'block';
    });
    document.getElementById('submitTx').addEventListener('click', addTransaction);
    
    // প্রতি ৩ সেকেন্ড পর পর UI আপডেট করে (রিয়েল টাইম দেখানোর ভান)
    setInterval(updateBalanceUI, 3000);
});

// সব লাইসেন্স বা ভ্যালিডেশন চেক মুছে ফেলা হয়েছে। এখন ১০০% কাজ করবে।

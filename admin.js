const SUPABASE_URL = 'https://kmwqrivcwbnjszektpfv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ryWge16HjFSoFPo7nrBMQQ_CWaFDtMG';
const API_URL = `${SUPABASE_URL}/rest/v1/stolen_devices`;

async function fetchAdminData() {
    console.log("Fetching admin data...");
    const tableBody = document.getElementById('adminTableBody');
    
    try {
        const response = await fetch(`${API_URL}?order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}` 
            }
        });
        const data = await response.json();
        console.log("Fetched data:", data);

        tableBody.innerHTML = '';
        data.forEach(item => {
            tableBody.innerHTML += `
                <tr>
                    <td>${new Date(item.created_at).toLocaleDateString()}</td>
                    <td>${item.imei}</td>
                    <td>${item.saps_case}</td>
                    <td class="status-${item.status.toLowerCase()}">${item.status}</td>
                    <td>
                        ${item.status === 'Pending' ? 
                        `<button class="btn-verify" onclick="verifyDevice('${item.id}')">Verify</button>` : 
                        'Confirmed'}
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Failed to load data");
    }
}

async function verifyDevice(id) {
    try {
        const response = await fetch(`${API_URL}?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Verified' })
        });

        if (response.ok) {
            const responseText = await response.text();
            if (responseText) {
                console.log("Update response:", JSON.parse(responseText));
            } else {
                console.log("Update response: No content (success)");
            }
            alert("Device Verified Successfully");
            fetchAdminData(); // Refresh list
        } else {
            const errorData = await response.json();
            console.error("Verification error:", errorData);
            alert(`Verification failed: ${errorData.message || `HTTP ${response.status}`}`);
        }
    } catch (err) {
        console.error("Verification error:", err);
        alert(`Verification failed: ${err.message}`);
    }
}

// Load data when page opens
window.onload = fetchAdminData;

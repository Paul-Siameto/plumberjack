import { useState } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

export default function AdminSettings() {
  const [form, setForm] = useState({
    businessName: 'ProPlumb Supply',
    phone: '+1 (555) 123-4567',
    whatsapp: '+1 (555) 987-6543',
    email: 'sales@proplumbsupply.com',
    lowStockThreshold: 20
  })
  const { success: showSuccess } = useToast()

  function handleSave(e) {
    e?.preventDefault()
    // Placeholder: persist to backend when API available
    showSuccess('Settings saved', 'Settings have been updated (local only)')
  }

  return (
    <div>
      
      <div className="settings-section">
        <h2 className="settings-title">Business Information</h2>
        <form className="settings-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Business Name</label>
            <input value={form.businessName} onChange={(e)=>setForm({...form,businessName:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
          </div>
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input value={form.whatsapp} onChange={(e)=>setForm({...form,whatsapp:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
          </div>
          <button type="submit" className="btn-save">Save Business Info</button>
        </form>
      </div>

      <div className="settings-section">
        <h2 className="settings-title">Inventory Alerts</h2>
        <form className="settings-form" onSubmit={(e)=>{e.preventDefault(); showSuccess('Threshold updated','(local only)')}}>
          <div className="form-group">
            <label>Low Stock Alert Threshold</label>
            <input type="number" value={form.lowStockThreshold} onChange={(e)=>setForm({...form,lowStockThreshold:Number(e.target.value)})} />
          </div>
          <button type="submit" className="btn-save">Update Threshold</button>
        </form>
      </div>
    </div>
  )
}

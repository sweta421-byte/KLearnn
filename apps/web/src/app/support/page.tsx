'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('faq')
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'general', message: '' })
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const faqs = [
    {
      category: '📚 Study',
      items: [
        { q: 'How do I join a study room?', a: 'Go to Study Rooms from dashboard, click on any room and press "Join Room" button.' },
        { q: 'Can I create my own study room?', a: 'Yes! Click "+ Create Room" button in Study Rooms page and fill in the details.' },
        { q: 'How do I track my study hours?', a: 'Go to Reports page and click "+ Log Study Session" to add your study sessions.' },
      ]
    },
    {
      category: '📝 Notes & Assignments',
      items: [
        { q: 'How do I create notes?', a: 'Go to Notes page, click "+ New Note", add title and content, then save.' },
        { q: 'How do I submit an assignment?', a: 'Go to Assignments page, find your assignment and click "Submit" button.' },
        { q: 'Can I like other students notes?', a: 'Yes! Click the ❤️ button on any note in the Notes page.' },
      ]
    },
    {
      category: '🔒 Account',
      items: [
        { q: 'How do I change my password?', a: 'Go to Settings → Password tab → Enter current and new password → Save.' },
        { q: 'How do I update my profile?', a: 'Go to Settings → Profile tab → Update your name and email → Save Changes.' },
        { q: 'How do I logout?', a: 'Go to Settings → Account tab → Click "Logout" button.' },
      ]
    },
    {
      category: '📅 Calendar & Resources',
      items: [
        { q: 'How do I add events to calendar?', a: 'Go to Calendar page, click on any date or "+ Add Event" button to create events.' },
        { q: 'How do I save study resources?', a: 'Go to Resources page, click "+ Add Resource", fill in title, URL and category.' },
        { q: 'Can I search my resources?', a: 'Yes! Use the search bar on Resources page to find resources by title, description or tags.' },
      ]
    },
  ]

  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('Your support ticket has been submitted! We will get back to you within 24 hours.')
    setTicketForm({ subject: '', category: 'general', message: '' })
    setTimeout(() => setSuccess(''), 5000)
  }

  const tabs = [
    { value: 'faq', label: '❓ FAQ' },
    { value: 'ticket', label: '🎫 Submit Ticket' },
    { value: 'contact', label: '📞 Contact' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>🆘 Support Center</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>How can we help you today?</p>
        </div>

        {success && (
          <div style={{ padding: '16px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', marginBottom: '24px', fontSize: '14px' }}>
            ✅ {success}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {tabs.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              style={{
                padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                backgroundColor: activeTab === tab.value ? '#6C63FF' : 'white',
                color: activeTab === tab.value ? 'white' : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {faqs.map(section => (
              <div key={section.category} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>{section.category}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setOpenFaq(openFaq === `${section.category}-${i}` ? null : `${section.category}-${i}`)}
                        style={{ width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: openFaq === `${section.category}-${i}` ? '#6C63FF10' : '#F9FAFB', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{item.q}</span>
                        <span style={{ color: '#6C63FF', fontSize: '18px' }}>{openFaq === `${section.category}-${i}` ? '−' : '+'}</span>
                      </button>
                      {openFaq === `${section.category}-${i}` && (
                        <div style={{ padding: '14px 16px', backgroundColor: '#6C63FF08', borderRadius: '0 0 10px 10px', fontSize: '14px', color: '#374151', lineHeight: 1.6, borderLeft: '3px solid #6C63FF', marginTop: '-4px' }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ticket Tab */}
        {activeTab === 'ticket' && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>🎫 Submit a Support Ticket</h2>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Describe your issue and we'll get back to you within 24 hours.</p>
            <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Subject</label>
                <input type="text" value={ticketForm.subject} onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  placeholder="Brief description of your issue" required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Category</label>
                <select value={ticketForm.category} onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px' }}>
                  <option value="general">General Issue</option>
                  <option value="account">Account Problem</option>
                  <option value="technical">Technical Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="billing">Billing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Message</label>
                <textarea value={ticketForm.message} onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                  placeholder="Describe your issue in detail..." rows={6} required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit"
                style={{ padding: '14px', backgroundColor: '#6C63FF', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>📞 Contact Us</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '📧', label: 'Email Support', value: 'support@klearn.app', desc: 'Response within 24 hours' },
                  { icon: '💬', label: 'Live Chat', value: 'Available 9 AM - 6 PM IST', desc: 'Mon-Fri only' },
                  { icon: '📱', label: 'WhatsApp', value: '+91 98765 43210', desc: 'Quick queries only' },
                ].map(contact => (
                  <div key={contact.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#6C63FF20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {contact.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>{contact.label}</p>
                      <p style={{ fontSize: '14px', color: '#6C63FF', marginBottom: '2px' }}>{contact.value}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>{contact.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>🕐 Support Hours</h3>
              {[
                { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM IST' },
                { day: 'Saturday', hours: '10:00 AM - 2:00 PM IST' },
                { day: 'Sunday', hours: 'Closed' },
              ].map(schedule => (
                <div key={schedule.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>{schedule.day}</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: schedule.hours === 'Closed' ? '#EF4444' : '#10B981' }}>{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
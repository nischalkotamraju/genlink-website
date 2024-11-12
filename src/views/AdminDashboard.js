import React, { useState, useEffect } from 'react'
import { db } from '../firebase/firebase-config'
import { collection, getDocs, addDoc } from 'firebase/firestore'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({ title: '', date: '', duration: '', description: '' })

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, 'users'))
      const eventsSnap = await getDocs(collection(db, 'events'))
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setEvents(eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
    fetchData()
  }, [])

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        createdAt: new Date().toISOString(),
        status: 'upcoming',
        attendees: []
      })
      setNewEvent({ title: '', date: '', duration: '', description: '' })
      const eventsSnap = await getDocs(collection(db, 'events'))
      setEvents(eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      alert('Error creating event: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e1e4b] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Members</h2>
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-white/10 p-4 rounded-lg mb-4">
                <div>
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateEvent} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Create Event</h2>
            <input type="text" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white mb-4" required />
            <input type="datetime-local" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white mb-4" required />
            <input type="number" placeholder="Duration (hours)" value={newEvent.duration} onChange={e => setNewEvent({...newEvent, duration: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white mb-4" required />
            <textarea placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white mb-4" rows="4" required />
            <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Create Event</button>
          </form>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Events</h2>
          {events.map(event => (
            <div key={event.id} className="bg-white/10 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">{event.title}</h3>
                  <p className="text-gray-300 text-sm">{new Date(event.date).toLocaleString()}</p>
                  <p className="text-gray-300 text-sm">Duration: {event.duration} hours</p>
                  <p className="text-gray-300 text-sm">Attendees: {event.attendees?.length || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
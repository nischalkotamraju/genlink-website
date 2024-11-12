import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/firebase-config'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore'

const Dashboard = () => {
  const navigate = useNavigate()
  const [state, setState] = useState({
    firstName: '', lastName: '', email: '', activeComponent: 'dashboard', volunteerHours: 0,
    isEditing: false, password: '', originalData: null, volunteerLog: [], bio: '',
    currentPassword: '', members: [], events: []
  })

  const { firstName, lastName, email, activeComponent, volunteerHours, isEditing, password,
    originalData, volunteerLog, bio, currentPassword, members, events } = state

  const buttonBaseClasses = "w-full py-3 px-6 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#132657] transition-all duration-300 shadow-lg transform hover:scale-[1.02]"

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return
      const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid))
      if (userSnap.exists()) {
        const data = userSnap.data()
        setState(prev => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          email: auth.currentUser.email,
          volunteerHours: data.volunteerHours,
          bio: data.bio,
          originalData: { firstName: data.firstName, lastName: data.lastName, email: auth.currentUser.email, bio: data.bio }
        }))
      }
      if (activeComponent === 'events') {
        const eventsSnap = await getDocs(collection(db, 'events'))
        setState(prev => ({ ...prev, events: eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) }))
      }
      if (activeComponent === 'members') {
        const membersSnap = await getDocs(collection(db, 'users'))
        setState(prev => ({ ...prev, members: membersSnap.docs.map(doc => doc.data()) }))
      }
    }
    fetchData()
  }, [activeComponent])

  const handleUpdateProfile = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { firstName, lastName, bio, isPublic: true })
      if (password?.trim()) {
        if (!currentPassword) throw new Error('Please enter your current password')
        await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser.email, currentPassword))
        await updatePassword(auth.currentUser, password)
      }
      setState(prev => ({ ...prev, password: '', currentPassword: '', isEditing: false, originalData: { firstName, lastName, email, bio }}))
    } catch (error) {
      alert('Failed to update profile: ' + error.message)
    }
  }

  const renderProfileContent = () => (
    <div className="bg-white/10 p-6 rounded-xl">
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="First Name" value={firstName} onChange={e => setState(prev => ({ ...prev, firstName: e.target.value }))} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white" maxLength={30}/>
            <input type="text" placeholder="Last Name" value={lastName} onChange={e => setState(prev => ({ ...prev, lastName: e.target.value }))} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white" maxLength={30}/>
          </div>
          <input type="email" placeholder="Email" value={email} disabled className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white opacity-50"/>
          <textarea placeholder="Bio" value={bio} onChange={e => setState(prev => ({ ...prev, bio: e.target.value }))} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white" rows="4" maxLength={200}/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setState(prev => ({ ...prev, currentPassword: e.target.value }))} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"/>
            <input type="password" placeholder="New Password" value={password} onChange={e => setState(prev => ({ ...prev, password: e.target.value }))} className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"/>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={handleUpdateProfile} className={`${buttonBaseClasses} bg-gradient-to-r from-green-500 to-green-600`}>Save Changes</button>
            <button onClick={() => setState(prev => ({ ...prev, ...prev.originalData, password: '', currentPassword: '', isEditing: false }))} className={`${buttonBaseClasses} bg-gradient-to-r from-gray-500 to-gray-600`}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{firstName} {lastName}</h3>
              <p className="text-gray-300">{email}</p>
            </div>
            <button onClick={() => setState(prev => ({ ...prev, isEditing: true }))} className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white">Edit Profile</button>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-2">About Me</h4>
            <p className="text-gray-300">{bio || 'No bio added yet.'}</p>
          </div>
        </div>
      )}
    </div>
  )

  const components = {
    profile: { title: 'Your Profile', desc: 'Manage your personal information and account settings here.', content: renderProfileContent() },
    volunteer: {
      title: 'Volunteer Activity',
      desc: 'Track your volunteer contributions and history.',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Hours', value: volunteerHours, color: 'green' },
              { label: 'Activities', value: volunteerLog?.length || 0, color: 'blue' },
              { label: 'Status', value: 'Active', color: 'yellow' }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 p-6 rounded-xl">
                <h4 className="text-xl font-bold text-white mb-2">{item.label}</h4>
                <p className={`text-3xl font-bold text-${item.color}-400`}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/10 p-6 rounded-xl">
            <h4 className="text-xl font-bold text-white mb-4">Recent Activity</h4>
            <div className="space-y-4">
              {volunteerLog?.map((log, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{log.description}</p>
                      <p className="text-sm text-gray-400">{log.date}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">{log.hours} hours</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    events: {
      title: 'Events',
      desc: 'View all upcoming events for volunteer opportunities.',
      content: (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-white/10 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white">{event.title}</h3>
              <p className="text-gray-300">{new Date(event.date).toLocaleString()}</p>
              <p className="text-gray-300">Duration: {event.duration} hours</p>
              <p className="text-gray-300">Attendees: {event.attendees?.length || 0}</p>
              <p className="text-gray-300 mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      )
    },
    members: {
      title: 'Members',
      desc: 'View all registered members.',
      content: (
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={index} className="bg-white/10 p-6 rounded-xl">
              <h4 className="text-xl font-bold text-white">{member.firstName} {member.lastName}</h4>
              <p className="text-gray-300">{member.email}</p>
              <p className="text-gray-300">{member.bio || 'No bio available.'}</p>
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1e4b] to-[#0a1735] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {activeComponent !== 'dashboard' && (
          <button onClick={() => setState(prev => ({ ...prev, activeComponent: 'dashboard' }))} className="mb-6 p-3 text-white rounded-xl font-medium bg-white/10 hover:bg-white/20 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        {activeComponent === 'dashboard' ? (
          <>
            <div className="space-y-4 mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center">Welcome back, {firstName}!</h2>
              <p className="text-center text-gray-300 text-xl">Manage your volunteer hours, watch out for events, and meet new people!</p>
            </div>            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(components).map(([key, { title, desc }]) => (
                <div key={key} onClick={() => setState(prev => ({ ...prev, activeComponent: key }))} className="p-6 bg-white/10 border border-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-300">{desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white">{components[activeComponent].title}</h3>
                <p className="text-gray-300 mt-2">{components[activeComponent].desc}</p>
              </div>
            </div>
            {components[activeComponent].content}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
import { io, Socket } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  let socket: Socket | null = null

  const socketUrl = 'http://localhost:3001'

  const connect = () => {
    if (!socket) {
      socket = io(socketUrl, {
        autoConnect: false,
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      })

      socket.on('connect', () => {
        console.log('✅ Socket.io connected to server:', socket?.id)
      })

      socket.on('disconnect', (reason) => {
        console.log('❌ Socket.io disconnected:', reason)
      })

      socket.on('connect_error', (error) => {
        console.error('🔴 Socket.io connection error:', error)
      })

      socket.on('dashboard_update', (data) => {
        console.log('📊 Dashboard update received:', data)
      })

      socket.on('renter_created', (data) => {
        console.log('👥 Renter created:', data)
      })
    }
    
    if (!socket.connected) {
      socket.connect()
    }
    
    return socket
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  }

  const joinVendorRoom = (vendorId: string) => {
    if (socket && vendorId) {
      socket.emit('join_vendor_room', vendorId)
    }
  }

  const leaveVendorRoom = (vendorId: string) => {
    if (socket && vendorId) {
      socket.emit('leave_vendor_room', vendorId)
    }
  }

  const onDashboardUpdate = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('dashboard_update', callback)
    }
  }

  const offDashboardUpdate = (callback?: (data: any) => void) => {
    if (socket) {
      if (callback) {
        socket.off('dashboard_update', callback)
      } else {
        socket.off('dashboard_update')
      }
    }
  }

  return {
    provide: {
      socket: {
        connect,
        disconnect,
        joinVendorRoom,
        leaveVendorRoom,
        onDashboardUpdate,
        offDashboardUpdate,
        get connected() {
          return socket?.connected || false
        },
        get instance() {
          return socket
        }
      }
    }
  }
})

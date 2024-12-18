import { defineStore } from 'pinia'
import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
  phone: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
  }),

  actions: {
    async getUsers() {
      const response = await axios.get<User[]>('http://localhost:8000/api/users')
      this.users = response.data
    },

    async getUser(id: number) {
      const response = await axios.get<User>(`http://localhost:8000/api/users/${id}`)
      return response.data
    },

    async addUser(user: User) {
      await axios.post('http://localhost:8000/api/users', user)
      this.users.push(user)
    },

    async updateUser(user: User, id: number) {
      await axios.put(`http://localhost:8000/api/users/${id}`, user)
      const index = this.users.findIndex(item => item.id === user.id)
      if (index !== -1) {
        this.users.splice(index, 1, user)
      }
    },

    async deleteUser(id: number) {
      await axios.delete(`http://localhost:8000/api/users/${id}`)
      const index = this.users.findIndex(item => item.id === id)
      if (index !== -1) {
        this.users.splice(index, 1)
      }
    },
  },
})


import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../models/User.model.js'

dotenv.config()

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    const email = process.argv[2] || 'admin@aquamart.com'
    const password = process.argv[3] || 'admin123'
    const name = process.argv[4] || 'Admin User'

    // Check if admin already exists
    const existing = await User.findOne({ email })
    if (existing) {
      // Update existing user to admin
      existing.role = 'admin'
      existing.name = name
      if (password !== 'admin123') {
        existing.password = password
      }
      await existing.save()
      console.log(`✅ Updated user "${email}" to admin role`)
    } else {
      // Create new admin user
      const admin = await User.create({
        name,
        email,
        password,
        role: 'admin'
      })
      console.log(`✅ Created admin user:`)
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
      console.log(`   Name: ${name}`)
    }

    process.exit(0)
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()


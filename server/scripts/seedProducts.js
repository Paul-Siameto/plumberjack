import dotenv from 'dotenv'
import { connectDatabase } from '../config/db.js'
import { Product } from '../models/Product.model.js'

dotenv.config()

const sampleProducts = [
  { name: 'Premium Alloy Steel Fittings', price: 149.99, rating: 5, category: 'pipes', brand: 'generic', images: ['https://ssmalloys.com/wp-content/uploads/2024/09/Alloy-Steel-Threaded-Fittings.jpg'], description: 'High quality alloy steel fittings.', stock: 50 },
  { name: 'Professional Plumbing Tool Kit', price: 279.99, rating: 4, category: 'tools', brand: 'generic', images: ['https://kempkerstruevalue.com/wp-content/uploads/2023/02/plumbing_tool_kit.jpg'], description: 'Complete plumbing tool kit for professionals.', stock: 30 },
  { name: 'Matte Black Centerset Faucet', price: 189.99, rating: 5, category: 'fixtures', brand: 'moen', images: ['https://www.deltafaucet.com/dw/image/v2/BFJJ_PRD/on/demandware.static/-/Sites-delta-master-catalog/default/dw6f0324a3/images/large/2554-BLMPU-DST_WATER_WEB.jpg?sw=1800&sh=1800&sm=fit'], description: 'Stylish matte black faucet.', stock: 20 },
  { name: 'Push-to-Connect Ball Valve', price: 59.99, rating: 4, category: 'valves', brand: 'sharkbite', images: ['https://www.sharkbite.com/sites/default/files/styles/1200x900/public/images/URSS3068FX18BV-product-photo.png.jpeg?h=827069f2&itok=k1_1zU96'], description: 'Reliable push-to-connect valve.', stock: 80 },
  { name: 'Electric Tank Water Heater', price: 449.99, rating: 5, category: 'heaters', brand: 'rheem', images: ['https://files.rheem.com/blobazrheem/wp-content/uploads/sites/2/tank.png'], description: 'Efficient electric water heater.', stock: 15 },
  { name: 'CPVC Pipe Bundle (10pcs)', price: 89.99, rating: 4, category: 'pipes', brand: 'generic', images: ['https://kanavalves.com/wp-content/uploads/2024/10/CPVC-UPVC-Fittings-Group-1024x727.jpg'], description: 'CPVC pipe bundle for plumbing projects.', stock: 100 },
  { name: 'Brass Gate Valve 1"', price: 34.99, rating: 4, category: 'valves', brand: 'sharkbite', images: ['https://dropinblog.net/34257794/files/featured/077b33f5-d30a-48f9-b2fa-fddbc6d060b7-1.jpeg'], description: 'Durable brass gate valve.', stock: 120 },
  { name: 'Pipe Wrench Set', price: 119.99, rating: 5, category: 'tools', brand: 'generic', images: ['https://i.redd.it/fsvygxo4kd661.jpg'], description: 'Heavy duty pipe wrench set.', stock: 40 }
]

async function seed() {
  try {
    let connected = false
    if (process.env.MONGO_URI) {
      try {
        await connectDatabase(process.env.MONGO_URI)
        console.log('[seed] Connected to DB via MONGO_URI')
        connected = true
      } catch (e) {
        console.warn('[seed] Failed to connect using MONGO_URI:', e.message || e)
      }
    }

    if (!connected && (process.env.NODE_ENV || 'development') === 'development') {
      const local = 'mongodb://127.0.0.1:27017/aquamart'
      try {
        await connectDatabase(local)
        console.log('[seed] Connected to local MongoDB fallback')
        connected = true
      } catch (e) {
        console.warn('[seed] Local fallback failed:', e.message || e)
      }
    }

    if (!connected) throw new Error('Unable to connect to any MongoDB instance')

    for (const p of sampleProducts) {
      const exists = await Product.findOne({ name: p.name })
      if (!exists) {
        await Product.create(p)
        console.log('[seed] Inserted:', p.name)
      } else {
        console.log('[seed] Already exists:', p.name)
      }
    }

    console.log('[seed] Seed complete')
    process.exit(0)
  } catch (e) {
    console.error('[seed] Error', e)
    process.exit(1)
  }
}

seed()

export default function Categories() {
  const cats = [
    { img: 'https://kanavalves.com/wp-content/uploads/2024/10/CPVC-UPVC-Fittings-Group-1024x727.jpg', title: 'Pipes & Fittings' },
    { img: 'https://dropinblog.net/34257794/files/featured/077b33f5-d30a-48f9-b2fa-fddbc6d060b7-1.jpeg', title: 'Valves & Connectors' },
    { img: 'https://i.redd.it/fsvygxo4kd661.jpg', title: 'Plumbing Tools' },
    { img: 'https://files.rheem.com/blobazrheem/wp-content/uploads/sites/2/tank.png', title: 'Water Heaters' },
    { img: 'https://i0.wp.com/hvilleblast.com/wp-content/uploads/2023/07/glssupply-19.jpg?resize=1024%2C683&quality=89&ssl=1', title: 'Bathroom & Kitchen Fixtures' }
  ]
  return (
    <section id="categories">
      <h2>Featured Categories</h2>
      <div className="grid">
        {cats.map((c, i) => (
          <div className="card" key={i}>
            <img src={c.img} alt={c.title} />
            <h3>{c.title}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}

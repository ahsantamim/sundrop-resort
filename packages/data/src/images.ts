/** Remote Unsplash images used across the demo. */
export function img(id: string, width = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`;
}

export const photos = {
  hero: img("photo-1573843981267-be1999ff37cd", 2400),
  lagoon: img("photo-1590523277543-a94d2e4eb00b"),
  poolVilla: img("photo-1566073771259-6a8506099945"),
  palms: img("photo-1499793983690-e29da59ef1c2"),
  spa: img("photo-1544161515-4ab6ce6db874"),
  dining: img("photo-1414235077428-338989a2e8c0"),
  jetty: img("photo-1505881502353-a1986add3762"),
  deck: img("photo-1584132967334-10e028bd69f7"),
  lagoonPool: img("photo-1520250497591-112f2f40a3f4"),
  island: img("photo-1516091877740-fde016699f2c", 2000),
  walkways: img("photo-1514282401047-d79a71a590e8"),
  boats: img("photo-1606546008984-41818b01968a"),
  bedroom: img("photo-1602002418082-a4443e081dd1"),
  nightPool: img("photo-1571896349842-33c89424de2d"),
  beach: img("photo-1507525428034-b723cf961d3e", 2000),
  land: img("photo-1500382017468-9049fed747ef", 2000),
  coast: img("photo-1473116763249-2faaef81ccda", 2000),
  reef: img("photo-1559827260-dc66d52bef19", 2000),
};

import { photos } from "@sundrop/data/images";

/** Sample experiences, shared by the landing page and /experiences. */
export const experiences = [
  {
    title: "Shapla Spa",
    titleBn: "শাপলা স্পা",
    copy: "Turmeric and coconut rituals in open-air pavilions. Sample menu, not a live spa book.",
    copyBn: "খোলা প্যাভিলিয়নে হলুদ ও নারকেলের আচার। নমুনা তালিকা, লাইভ স্পা বুকিং নয়।",
    tag: "Sample · from ৳4,500",
    tagBn: "নমুনা · ৳৪,৫০০ থেকে",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=75",
    alt: "Spa table with linen",
  },
  {
    title: "Ilish & Ember",
    titleBn: "ইলিশ অ্যান্ড এম্বার",
    copy: "A sample dining note: bay seafood and a low-tide chef’s table on the plan.",
    copyBn: "নমুনা খাবারের কথা: উপসাগরের মাছ আর ভাটার সময় শেফের টেবিল।",
    tag: "Breakfast included in the sample rate",
    tagBn: "নমুনা ভাড়ায় সকালের নাস্তা",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=75",
    alt: "A plated dish",
  },
  {
    title: "Reef & Jetty",
    titleBn: "রিফ ও জেটি",
    copy: "Snorkelling, kayaks and boat time with Saint Martin’s boatmen — described here, not sold as a ticket.",
    copyBn: "স্নরকেলিং, কায়াক ও সেন্ট মার্টিনের মাঝিদের সাথে নৌকা — বর্ণনা, টিকিট বিক্রি নয়।",
    tag: "Shown on the sample day plan",
    tagBn: "নমুনা দিনসূচিতে",
    image: "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=800&q=75",
    alt: "Wooden jetty over clear water",
  },
  {
    title: "Sunset Deck",
    titleBn: "সানসেট ডেক",
    copy: "Daab, a Friday music note, and the west-facing seat. Sample evening plan.",
    copyBn: "ডাব, শুক্রবারের সঙ্গীতের নোট, আর পশ্চিমমুখী আসন। নমুনা সন্ধ্যার পরিকল্পনা।",
    tag: "Every evening on the sample plan",
    tagBn: "নমুনা পরিকল্পনায় প্রতি সন্ধ্যা",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=75",
    alt: "Sun loungers by the water",
  },
];

/** The sample day, used by the landing gallery and the experiences timeline. */
export const sampleDay = [
  { src: photos.walkways, en: "06:10 · First light on the walkways", bn: "০৬:১০ · ভোরের আলো", alt: "Aerial of overwater walkways" },
  { src: photos.boats, en: "11:00 · Saint Martin’s boats", bn: "১১:০০ · সেন্ট মার্টিনের নৌকা", alt: "Wooden boats on the Saint Martin’s shore" },
  { src: photos.bedroom, en: "14:30 · Siesta", bn: "১৪:৩০ · দুপুরের বিশ্রাম", alt: "A bright bedroom" },
  { src: photos.nightPool, en: "21:00 · Pool under the stars", bn: "২১:০০ · তারার নিচে পুল", alt: "Pool at night" },
];

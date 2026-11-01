export function guestLabel(adults: number, children: number, lang: "en" | "bn") {
  if (lang === "bn") {
    return `${adults.toLocaleString("bn-BD")} জন প্রাপ্তবয়স্ক${children ? `, ${children.toLocaleString("bn-BD")} শিশু` : ""}`;
  }
  return `${adults} adult${adults > 1 ? "s" : ""}${children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}`;
}

const LABEL: Record<string, string> = {
  paid: "Paid",
  scheduled: "Scheduled",
  open: "Open",
  closing: "Closing",
  funded: "Funded",
  under_review: "In review",
  approved: "Approved",
  declined: "Declined",
};

export function Status({ value }: { value: string }) {
  return <span className={`pill ${value}`}>{LABEL[value] ?? value}</span>;
}

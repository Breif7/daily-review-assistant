/** Monday-first week range containing `date`. */
export function weekRange(date = new Date()) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  const days = Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return x.toISOString().slice(0, 10);
  });
  return { monday: days[0], sunday: days[6], days };
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

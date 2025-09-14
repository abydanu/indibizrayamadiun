export const submitForm = async (data: FormData) => {
  const res = await fetch("/api/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Gagal submit")
  return res.json()
}

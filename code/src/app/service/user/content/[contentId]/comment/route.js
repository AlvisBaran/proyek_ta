// User > Content > Comment > Read All
export async function GET() {
  // TODO: Fetch smua comment yang ada dari sebuah content
  // TODO: Ada opsi untuk load lengkap (reply)
  return Response.json({ message: "User > Content > Comment > Read All" })
}

// User > Content > Comment > Create
export async function POST() {
  // TODO: Inser comment baru ke db
  return Response.json({message: "User > Content > Comment > Create"});
}
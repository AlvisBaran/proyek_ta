import Bank from '@/backend/models/bank'

export const dynamic = 'force-dynamic'

// ** Bank > Read All
export async function GET() {
  const banks = await Bank.findAll()
  return Response.json(banks, { status: 200 })
}

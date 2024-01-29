// Transaction > Top Up > Read One
export async function GET(request, { params }) {
  const { invoice } = params;
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  let res = {};

  return Response.json({message: "Transaction > Top Up > Read One", userId, invoice})
}

// Transaction > Top Up > Update (Payment Gateway)
export async function PUT(request, { params }) {
  const { invoice } = params;
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  return Response.json({message: "Transaction > Top Up > Update (Payment Gateway)", invoice, req})
}

// Transaction > Top Up > Cancel
export async function DELETE(request, { params }) {
  const { invoice } = params;
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  let req = {};
  try { req = await request.json(); } catch (e) {}
  let res = {};

  return Response.json({message: "Transaction > Top Up > Cancel", userId, invoice, req})
}
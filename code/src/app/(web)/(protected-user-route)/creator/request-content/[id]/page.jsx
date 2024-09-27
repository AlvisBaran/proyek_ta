import { redirect } from 'next/navigation'

export default function CreatorRequestContentDetailRedirectorPage({ params }) {
  const id = params.id
  return redirect(`/creator/request-content/${id}/detail`)
}

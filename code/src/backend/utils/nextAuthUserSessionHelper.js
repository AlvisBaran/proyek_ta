export function composeName(id, displayName, role, cUsername, banStatus) {
  return JSON.stringify({
    id,
    displayName,
    role,
    cUsername,
    banStatus
  })
}

export function decomposeName(name) {
  try {
    return JSON.parse(name)
  } catch (err) {
    console.error('ERROR di Decompose Name')
    console.error(err)
    return {
      id: 0,
      displayName: 'Error Decomposing Name',
      role: 'normal',
      cUsername: null,
      banStatus: 'clean'
    }
  }
}

export function getUserFromComposedSession(session) {
  if (!!session && !!session.user)
    return {
      ...decomposeName(session.user.name),
      email: session.user.email,
      profilePicture: session.user.image
    }

  return null
}

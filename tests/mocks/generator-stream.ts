async function* createMockStream() {
  const chunks = [
    `{"title":"Contact Form","fields":[{"name":"name","type":"text","label":"Full Name","placeholder":"Enter your name","required":true},{"name":"email","type":"email","label":"Email Address","placeholder":"you@example.com","required":true},{"name":"message","type":"textarea","label":"Message","placeholder":"Write your message","required":true}],"submitLabel":"Send Message"}`,
  ]

  for (const chunk of chunks) {
    yield chunk
  }
}

export function mockGeneratorStream() {
  return createMockStream()
}

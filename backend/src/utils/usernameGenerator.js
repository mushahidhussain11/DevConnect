function generateUsername(name, email) {
  const base = name || email?.split('@')[0] || 'user';
  const suffix = Math.floor(Math.random() * 10000); // Ensures uniqueness
  return `${base.toLowerCase().replace(/\s+/g, '_')}_${suffix}`;
}

export default generateUsername;
function resolveAuthorizationHeader(ctx) {
  if (!ctx.header || !ctx.header.authorization) {
    return;
  }

  const parts = ctx.header.authorization.trim().split(" ");

  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
}

module.exports = {
  resolveAuthorizationHeader,
};

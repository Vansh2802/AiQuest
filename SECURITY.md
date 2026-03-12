# 🔒 Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in AI Quest, please report it by emailing the maintainer or creating a private security advisory on GitHub.

**DO NOT** create public issues for security vulnerabilities.

---

## Security Best Practices

### 🔐 Environment Variables

**All sensitive information must be stored in environment variables:**

- JWT secrets for authentication
- API keys (Anthropic, OpenAI, etc.)
- Database connection strings
- Any credentials or tokens

**Never commit these to version control!**

### 📋 Required Environment Variables

#### Backend (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing | Generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017` or Atlas URI |
| `DATABASE_NAME` | MongoDB database name | `aiquest` |

#### Backend (Optional)

| Variable | Description | Required? |
|----------|-------------|-----------|
| `ANTHROPIC_API_KEY` | Claude API key for AI features | No - has fallbacks |
| `OPENAI_API_KEY` | OpenAI API key | No |
| `LOCAL_LLM_PATH` | Path to local LLM model | No |

#### Frontend (Optional)

Frontend should **NEVER** contain secrets. Only public configuration:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

---

## 🛡️ Security Checklist

### Before Deployment

- [ ] All secrets are in environment variables
- [ ] `.env` files are in `.gitignore`
- [ ] No secrets in git history
- [ ] Strong JWT_SECRET is generated (min 32 chars)
- [ ] Production uses HTTPS
- [ ] CORS is properly configured
- [ ] Database has authentication enabled
- [ ] API rate limiting is considered

### Code Security

- [ ] No secrets in console.log or print statements
- [ ] User input is sanitized
- [ ] Passwords are hashed with bcrypt
- [ ] JWT tokens expire appropriately (24h default)
- [ ] API endpoints require authentication where needed

### Git Security

```bash
# Check for secrets in git history
git log --all -S "sk-ant" --oneline
git log --all -S "mongodb+srv" --oneline

# If secrets found, consider rotating them immediately
```

---

## 🔄 Secret Rotation

### When to Rotate Secrets

- After any suspected compromise
- When team members with access leave
- Regularly (every 90 days for JWT_SECRET)
- After any security incident

### How to Rotate

1. **JWT_SECRET**: Generate new secret, update environment variables, users must re-login
2. **API Keys**: Generate new key in provider dashboard, update environment variables
3. **Database Credentials**: Update in MongoDB Atlas, update connection string

---

## 🌐 Production Deployment Security

### Render / Vercel / Railway

1. **Set secrets via dashboard** - never commit them
2. **Use HTTPS** - enabled by default on these platforms
3. **Enable CORS properly** - restrict to your frontend domain
4. **Monitor logs** - check for suspicious activity

### Environment Variable Best Practices

```bash
# ✅ GOOD - Using environment variables
JWT_SECRET = os.getenv("JWT_SECRET")

# ❌ BAD - Hardcoded secret
JWT_SECRET = "my-secret-key-123"
```

---

## 📦 Dependencies

### Keep Dependencies Updated

```bash
# Backend
pip list --outdated
pip install --upgrade fastapi uvicorn

# Frontend
npm outdated
npm update
```

### Security Audits

```bash
# Python
pip install safety
safety check

# Node.js
npm audit
npm audit fix
```

---

## 🚨 Incident Response

If secrets are exposed:

1. **Immediately rotate** all exposed credentials
2. **Check logs** for unauthorized access
3. **Notify users** if data was compromised
4. **Review access** - revoke unnecessary permissions
5. **Update security practices** to prevent recurrence

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## ✅ Security Compliance

This project follows:

- Secure password storage (bcrypt)
- JWT authentication with expiration
- Environment-based configuration
- No secrets in source code
- Input validation and sanitization
- HTTPS in production
- Regular dependency updates

---

Last Updated: March 12, 2026

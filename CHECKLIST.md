# Deployment Checklist

Use this checklist to ensure a smooth deployment.

## Pre-Deployment

### Local Testing
- [ ] Run `./verify-setup.sh` - all checks pass
- [ ] Backend starts without errors: `cd backend && python main.py`
- [ ] Frontend starts without errors: `cd frontend && npm run dev`
- [ ] Health endpoint responds: `curl http://localhost:8000/health`
- [ ] API docs accessible: http://localhost:8000/docs
- [ ] Frontend connects to backend
- [ ] Test scraping works: `curl -X POST http://localhost:8000/api/v1/test`

### Docker Testing
- [ ] Docker installed and running
- [ ] `.env` file created from `.env.example`
- [ ] Lightweight build succeeds: `docker-compose build`
- [ ] Lightweight containers start: `docker-compose up -d`
- [ ] Services healthy: `docker-compose ps`
- [ ] Logs show no errors: `docker-compose logs`
- [ ] If using browsers: `docker-compose -f docker-compose.browsers.yml up -d`

### Configuration Review
- [ ] All `.env` files created from examples
- [ ] Secrets not hardcoded anywhere
- [ ] CORS origins configured appropriately
- [ ] Ports don't conflict with existing services
- [ ] Supabase credentials added (if using)
- [ ] Log level appropriate for environment

## Production Deployment

### Pre-Production
- [ ] Choose deployment platform (VPS/Cloud/Container)
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate ready (Let's Encrypt/CloudFlare)
- [ ] Firewall rules planned
- [ ] Backup strategy defined
- [ ] Monitoring solution chosen

### Server Setup (VPS/Cloud)
- [ ] Server provisioned and accessible via SSH
- [ ] Ubuntu/Debian updated: `sudo apt update && sudo apt upgrade`
- [ ] Docker installed: `curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh`
- [ ] Docker Compose installed
- [ ] Non-root user created (optional but recommended)
- [ ] Firewall configured: ports 80, 443, 22
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled

### Application Deployment
- [ ] Code uploaded to server
- [ ] `.env` file configured for production
- [ ] `ENVIRONMENT=production` set
- [ ] CORS origins restricted (not wildcard)
- [ ] Containers built: `docker-compose build`
- [ ] Containers started: `docker-compose up -d`
- [ ] Services running: `docker ps`
- [ ] Health check passes: `curl http://localhost:8000/health`
- [ ] Auto-restart enabled: `docker update --restart unless-stopped scrapling-backend scrapling-frontend`

### Reverse Proxy (if using Nginx)
- [ ] Nginx installed: `sudo apt install nginx`
- [ ] Configuration file created in `/etc/nginx/sites-available/`
- [ ] Configuration enabled: `sudo ln -s /etc/nginx/sites-available/scrapling /etc/nginx/sites-enabled/`
- [ ] Configuration tested: `sudo nginx -t`
- [ ] Nginx reloaded: `sudo systemctl reload nginx`
- [ ] Service accessible via domain

### SSL Configuration
- [ ] Certbot installed: `sudo apt install certbot python3-certbot-nginx`
- [ ] SSL certificate obtained: `sudo certbot --nginx -d yourdomain.com`
- [ ] Auto-renewal enabled (Certbot does this automatically)
- [ ] HTTPS works: `curl https://yourdomain.com/health`
- [ ] HTTP redirects to HTTPS

### Security Hardening
- [ ] Firewall rules active: `sudo ufw enable`
- [ ] Only necessary ports open (80, 443, 22)
- [ ] SSH port changed (optional)
- [ ] Fail2ban installed (optional): `sudo apt install fail2ban`
- [ ] Regular updates enabled: `sudo apt install unattended-upgrades`
- [ ] Root login disabled
- [ ] Strong passwords or key-only authentication
- [ ] Environment variables secured
- [ ] Logs not exposing sensitive data

## Post-Deployment

### Verification
- [ ] Frontend accessible: `curl https://yourdomain.com`
- [ ] Backend API accessible: `curl https://yourdomain.com/health`
- [ ] API documentation accessible: https://yourdomain.com/docs
- [ ] Test scraping through UI
- [ ] Test scraping through API
- [ ] Error handling works correctly
- [ ] Logs are being generated
- [ ] No sensitive data in logs

### Monitoring Setup
- [ ] Health check monitoring configured
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Log aggregation (CloudWatch, Papertrail, etc.)
- [ ] Error tracking (Sentry, Rollbar, etc.)
- [ ] Resource monitoring (CPU, RAM, disk)
- [ ] Alert notifications configured
- [ ] Dashboard created (Grafana, CloudWatch, etc.)

### Performance
- [ ] Response times acceptable
- [ ] No memory leaks detected
- [ ] CPU usage normal
- [ ] Disk space adequate
- [ ] Browser fetchers working (if enabled)
- [ ] Concurrent requests handled properly

### Documentation
- [ ] Deployment documented
- [ ] Access credentials securely stored
- [ ] Backup procedures documented
- [ ] Recovery procedures documented
- [ ] Team members trained
- [ ] Runbook created for common issues

### Backup Strategy
- [ ] Database backup configured (Supabase handles this)
- [ ] Configuration files backed up
- [ ] Backup restoration tested
- [ ] Backup schedule automated
- [ ] Off-site backups configured

## Ongoing Maintenance

### Daily
- [ ] Check service health
- [ ] Review error logs
- [ ] Monitor resource usage

### Weekly
- [ ] Review metrics and alerts
- [ ] Check for unusual patterns
- [ ] Verify backups are running
- [ ] Review security logs

### Monthly
- [ ] Update dependencies: `docker-compose pull && docker-compose up -d`
- [ ] Review and rotate logs
- [ ] Security audit
- [ ] Performance review
- [ ] Test disaster recovery
- [ ] Update documentation

### Quarterly
- [ ] Major version updates
- [ ] Security assessment
- [ ] Capacity planning
- [ ] Cost optimization review

## Troubleshooting Checklist

If something goes wrong:

- [ ] Check service status: `docker-compose ps`
- [ ] View logs: `docker-compose logs -f`
- [ ] Check health endpoints: `curl http://localhost:8000/health`
- [ ] Verify environment variables: `docker-compose config`
- [ ] Check disk space: `df -h`
- [ ] Check memory: `free -h`
- [ ] Check CPU: `top` or `htop`
- [ ] Restart services: `docker-compose restart`
- [ ] Rebuild if needed: `docker-compose up -d --build`
- [ ] Check firewall: `sudo ufw status`
- [ ] Check Nginx: `sudo nginx -t && sudo systemctl status nginx`
- [ ] Review recent changes
- [ ] Check SSL certificate: `sudo certbot certificates`

## Rollback Plan

If deployment fails:

- [ ] Stop new containers: `docker-compose down`
- [ ] Restore previous version from git
- [ ] Rebuild: `docker-compose build`
- [ ] Start: `docker-compose up -d`
- [ ] Verify rollback: `curl http://localhost:8000/health`
- [ ] Investigate issue in development environment
- [ ] Document what went wrong

## Success Criteria

Deployment is successful when:

- [ ] All health checks passing
- [ ] Frontend accessible and functional
- [ ] API responding correctly
- [ ] No errors in logs (past startup)
- [ ] SSL certificate valid
- [ ] Performance metrics acceptable
- [ ] Monitoring alerts configured
- [ ] Team notified of deployment
- [ ] Documentation updated

---

## Quick Reference

### Useful Commands

```bash
# Check all services
docker-compose ps

# View all logs
docker-compose logs -f

# Restart everything
docker-compose restart

# Update and restart
docker-compose pull && docker-compose up -d

# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check disk space
df -h

# Check memory
free -h

# Check processes
top

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# SSL certificate
sudo certbot certificates
sudo certbot renew --dry-run
```

### Emergency Contacts

- [ ] DevOps team: _____________
- [ ] On-call engineer: _____________
- [ ] Hosting support: _____________
- [ ] SSL provider: _____________

---

**Remember:** Test in development, stage in staging, deploy to production!

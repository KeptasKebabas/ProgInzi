# Server Hosting Documentation

## Project Hosting Overview

This project is hosted using a cloud VPS deployment architecture. The website is deployed on a Linux server using Nginx as a web server, with a custom domain and HTTPS security enabled.

## Infrastructure Architecture

The hosting architecture follows this flow:

User Browser
    ↓
Domain (askktu.online)
    ↓
DNS (DigitalOcean Nameservers)
    ↓
Public Server IP (VPS)
    ↓
Nginx Web Server
    ↓
React Frontend Application

## Cloud Hosting Provider

The project is hosted on a Virtual Private Server (VPS) provided by DigitalOcean.

Server specifications include:
- Ubuntu Linux Server
- Public IPv4 Address
- Nginx Web Server
- Node.js environment for build tools

## Domain Configuration

The domain was purchased from Namecheap and configured to point to DigitalOcean DNS servers.

Nameservers Used:
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com

DNS records were configured to point the domain to the server IP address using A records:
askktu.online → Server IP
www.askktu.online → Server IP

## Frontend Deployment

The frontend was built using:
- React
- TypeScript
- Vite build system

Build commands:
npm install
npm run build

Production build directory:
dist/

Served via Nginx.

## Web Server Configuration

Nginx serves static frontend files.

Configuration includes:
- Correct server_name configuration
- Root path pointing to build directory

Example:
root /var/www/ProgramavimoProjektas/WebPage/dist;

## HTTPS Security

HTTPS was enabled using Let's Encrypt SSL certificates via Certbot.

Provides:
- Data encryption
- Secure communication
- Browser security compliance

## Security Measures

- HTTPS encryption
- Domain validation
- Server traffic routing

Future improvements:
- Firewall hardening
- Rate limiting
- Authentication protection

## Deployment Tools Used

- DigitalOcean VPS
- Namecheap Domain Registration
- Nginx Web Server
- Certbot SSL Management
- Linux Server Deployment

## Testing

https://askktu.online

http://SERVER_PUBLIC_IP

## Future Improvements

- Backend AI API integration
- Database optimization
- CI/CD automation
- Load balancing
- Monitoring

## Developer Notes

This project demonstrates real-world production deployment workflows including cloud hosting, DNS routing, web server configuration, and SSL security implementation.

# Job.Com — Remote Testing & Multi-User Sharing Guide

This guide explains how to share your local **Job.Com** instance with external testers, colleagues, and candidates across different computers and mobile devices.

---

## Important Prerequisite: Camera & Microphone (HTTPS Requirement)

> [!IMPORTANT]
> **Webcam & Microphone Browser Security:**
> Modern web browsers (Chrome, Safari, Edge, Firefox) **strictly enforce HTTPS** for webcam and audio permissions (`navigator.mediaDevices.getUserMedia`) whenever accessing a website from an external device.
> * If testers use a **Public HTTPS Tunnel** (Method 1), camera and audio will work immediately on their laptops, iPhones, and Android phones.
> * If testers connect via raw local HTTP (`http://192.168.x.x:3000`), the browser may disable camera access for video interview questions unless an HTTPS tunnel is used.

---

## Method 1: Instant Public HTTPS Tunnel (Recommended)

Generate a secure, shareable public HTTPS link that anyone on the internet can click to test the full application (including Video Interviews, AI Resume Builder, and Recruiter Review Desk).

### Option A: 1-Click NPM Share (Built-in)
In your terminal, while your Next.js dev server is running on port 3000:
```bash
npm run share
```
* **Output:**
  ```text
  your url is: https://curvy-friends-speak.loca.lt
  ```
* **Usage:** Send that HTTPS link to your testers. When opening for the first time, `localtunnel` may ask for your public IP address (you can find it by typing `curl ifconfig.me` or visiting [whatismyip.com](https://whatismyip.com)).

---

### Option B: Cloudflare Quick Tunnel (No Password / No Interstitial)
Cloudflare provides free, high-speed ephemeral HTTPS tunnels without requiring an account:
1. Run with `npx`:
   ```bash
   npx -y untun@latest tunnel http://localhost:3000
   ```
2. Or download `cloudflared.exe` and run:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
* **Output:** Gives you a direct URL such as `https://unique-subdomain.trycloudflare.com`.
* Testers can immediately open it with zero prompt screens.

---

### Option C: ngrok
If you already have [ngrok](https://ngrok.com) installed:
```bash
ngrok http 3000
```
Provides a clean forwarding address: `https://xxxx.ngrok-free.app`.

---

## Method 2: Same Wi-Fi / Local Office Network (LAN)

If all testers are connected to the same Wi-Fi router or office network:

1. **Find your local IP address:**
   In PowerShell:
   ```powershell
   (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*").IPAddress
   ```
   *(Your current local network IP is: `http://192.168.29.97:3000`)*

2. **Allow Inbound Connections in Windows Firewall (Port 3000):**
   If other devices on your Wi-Fi cannot connect, open PowerShell as Administrator and run:
   ```powershell
   New-NetFirewallRule -DisplayName "Job.Com Next.js Dev (3000)" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
   ```

3. **Share the URL:**
   Colleagues on the same Wi-Fi can open:
   ```text
   http://192.168.29.97:3000
   ```
   *(Note: As mentioned above, for video interview webcam recording, use an HTTPS tunnel in Method 1).*

---

## Method 3: Permanent 24/7 Cloud Deployment (Vercel)

If you want a permanent link that remains active even when your local computer is powered off:

1. Push your repository to GitHub / GitLab.
2. Visit [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `Job.Com` repository.
4. Click **Deploy**.
   * Vercel assigns a free production domain: `https://job-com.vercel.app` with global CDN caching and automatic SSL.

---

## Tester Reference Credentials

Share the generated [`Sample_Login_Credentials_and_Test_Data.xlsx`](file:///d:/Antigravity%20Projects/Sample_Login_Credentials_and_Test_Data.xlsx) with your testers.

* **Universal Password:** `Password123!`
* **Recruiter Personas:**
  * Accounting: `robert.sterling@apexfinancial.com`
  * Logistics: `maria.sanchez@transglobal.com`
  * Mechanical: `vikram.sengupta@titanmfg.com`
  * Pharma: `aris.thorne@biopharm.org`
  * Technology: `sarah.jenkins@nexus.ai`
* **Candidate Personas:**
  * Accounting Fresher: `aarav.mehta@example.com`
  * Logistics Fresher: `chloe.dubois@example.com`
  * Mechanical Fresher: `kevin.zhao@example.com`
  * Senior CPA: `david.kramer@example.com`
  * Mechanical Lead: `elena.rostova@example.com`
* **Direct Screening Room URLs:**
  * Instant Video Practice: `/interview/demo-candidate-1`
  * Mechanical Requisition: `/interview/kevin-zhao-mech-2026`
* **Candidate AI Resume Studio:**
  * `/candidate/resume-builder` (100% Free AI builder + ₹1,000 / 30-min expert consultation)

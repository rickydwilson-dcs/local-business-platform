# Operations: Email, Domains & Google Workspace

Plan for our own email setup, client domain/email management, and business automation.

---

## Our Email Setup

### Current State

- **Google Workspace account:** hello@rickyai.co.uk
- **Desired public email:** ricky@digitalconsultingservices.co.uk
- **DCS domain:** digitalconsultingservices.co.uk (hosted on own server)

### Setup: Add DCS as Secondary Domain in Google Workspace

1. [ ] Go to Google Admin Console > Domains > Manage domains
2. [ ] Add digitalconsultingservices.co.uk as a secondary domain
3. [ ] Verify domain ownership (TXT record or CNAME)
4. [ ] Create user alias: ricky@digitalconsultingservices.co.uk
5. [ ] Update DNS records on your server:

**DNS records needed on digitalconsultingservices.co.uk:**

| Type | Name               | Value                                                                    |
| ---- | ------------------ | ------------------------------------------------------------------------ |
| MX   | @                  | ASPMX.L.GOOGLE.COM (priority 1)                                          |
| MX   | @                  | ALT1.ASPMX.L.GOOGLE.COM (priority 5)                                     |
| MX   | @                  | ALT2.ASPMX.L.GOOGLE.COM (priority 5)                                     |
| MX   | @                  | ALT3.ASPMX.L.GOOGLE.COM (priority 10)                                    |
| MX   | @                  | ALT4.ASPMX.L.GOOGLE.COM (priority 10)                                    |
| TXT  | @                  | v=spf1 include:\_spf.google.com ~all                                     |
| TXT  | google.\_domainkey | (DKIM key from Google Admin Console)                                     |
| TXT  | \_dmarc            | v=DMARC1; p=quarantine; rua=mailto:ricky@digitalconsultingservices.co.uk |

6. [ ] Test sending and receiving
7. [ ] Set ricky@digitalconsultingservices.co.uk as default "Send as" in Gmail

---

## Client Domain & Email Service

We buy and manage domains on behalf of clients. We configure Google Workspace for their business email. This replaces self-hosted email — less maintenance, better deliverability, clients get Gmail/Google Calendar/Drive.

### Domain Management

- [ ] Choose a registrar for bulk domain purchases (Cloudflare Registrar = at-cost pricing, no markup)
- [ ] Create standard DNS template for client sites (A/CNAME → Vercel, MX → Google, SPF/DKIM/DMARC)
- [ ] Document domain setup checklist (purchase → DNS → Vercel → SSL → verify)
- [ ] Track all managed domains in a spreadsheet or the Supabase registry

### Google Workspace for Clients

**How it works:** We set up Google Workspace on the client's domain. Client gets info@theirbusiness.co.uk (or whatever they want). Google bills them directly, or we can become a Google Workspace reseller.

**Option A — Direct billing (simpler):**

- Create Workspace account under client's domain
- Client pays Google directly (~£5.50/user/month for Business Starter)
- We handle setup, DNS config, and initial training
- Charge a one-off setup fee (included in site package or £50 standalone)

**Option B — Reseller (more control, small margin):**

- Sign up as Google Workspace reseller (via Google or a reseller panel like Zoho/WHMCS)
- We bill clients, mark up slightly (£7-8/user/month vs Google's £5.50)
- We get admin access to all client Workspaces
- More overhead but better client management

**Recommendation:** Start with Option A (direct billing). Simpler, no reseller overhead. Switch to reseller if we reach 20+ clients and want consolidated billing.

### Actions

- [ ] Set up first client Workspace (use Smith's Electrical as test case)
- [ ] Document the Google Workspace setup process (step-by-step for repeatability)
- [ ] Decide on reseller vs direct billing (revisit at 20 clients)

---

## Business Automation

### Google Sheets CRM

- [ ] Create a simple client tracking sheet (mirrors `tasks/clients/_pipeline.md`)
- [ ] Columns: client name, trade, stage, contact info, domain, last contact date, notes
- [ ] Consider Google Apps Script to send automated follow-up reminders

### Client Onboarding Automation

- [ ] Google Form for client intake (maps to intake checklist in `_pipeline.md`)
- [ ] Apps Script: form submission triggers email to client with next steps
- [ ] Apps Script: form submission creates row in CRM sheet
- [ ] Template emails: welcome, "we need your logo", "site ready for review", "site is live"

### Calendar Integration

- [ ] Set up booking link (Google Calendar appointment scheduling or Calendly)
- [ ] Embed on DCS website for prospects to book a discovery call

### Google Drive Structure

- [ ] Create `My Drive/Clients/` folder
- [ ] Create template subfolder structure (logo/, photos/, brand-guidelines/, documents/)
- [ ] For each new client, duplicate template folder

---

## Platform Integration (Future)

- Intake form responses could feed directly into `tools/create-site-from-project.ts`
- Client status changes in Sheets could trigger notifications
- Automated monthly reports from Supabase metrics → client email
- Domain purchase could be semi-automated via Cloudflare API

Start with manual processes, automate once the workflow is proven.

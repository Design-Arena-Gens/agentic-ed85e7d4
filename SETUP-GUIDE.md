# 🚀 Quick Setup Guide - AI Book Generator

## Step 1: Import to n8n

1. Open your n8n instance
2. Click **Workflows** → **Import**
3. Choose **From File**
4. Select `n8n-book-generator-workflow.json`
5. Click **Import**

## Step 2: Get Google Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key
4. In n8n: **Settings** → **Environments** → Add:
   - Name: `GOOGLE_GEMINI_API_KEY`
   - Value: `your_key_here`

## Step 3: Setup Google Docs Access

### Option A: Service Account (Easiest)

1. Go to: https://console.cloud.google.com/
2. Create new project: **"AI Book Generator"**
3. Enable APIs:
   - Google Docs API
   - Google Drive API
4. **IAM & Admin** → **Service Accounts** → **Create**
5. Download JSON key file
6. In n8n:
   - **Credentials** → **Add**
   - Type: **Google Service Account**
   - Upload JSON file
   - Name: "Google Service Account"
   - Save

### Option B: OAuth2

1. Google Cloud Console → **APIs & Services** → **Credentials**
2. Create **OAuth 2.0 Client ID**
3. Add redirect: `https://your-n8n-url/rest/oauth2-credential/callback`
4. In n8n: Add Google OAuth2 credentials

## Step 4: Configure Your Book

Edit **"Manual Trigger - Set Book Details"** node:

```javascript
bookTopic: "Your Amazing Book Title"
bookType: "non-fiction"  // or "fiction", "handbook"
targetWords: "40000"     // 30k-50k recommended
authorName: "Your Name"
authorBio: "Brief bio about you..."
includeImages: "yes"
```

## Step 5: Run It! 🎉

1. Click **"Execute Workflow"** button
2. Wait 5-15 minutes
3. Copy the Google Docs link from output
4. Open and edit your book!

## 📖 What You Get

✅ Complete book with 10-15 chapters
✅ Professional formatting
✅ Introduction & Conclusion
✅ About the Author section
✅ Image placeholders
✅ Ready to edit Google Doc

## ⚙️ Recommended Settings

**For Non-Fiction (How-To, Business, Self-Help):**
- bookType: "non-fiction"
- targetWords: 40000
- Result: ~160 pages, 12-15 chapters

**For Fiction (Novel, Memoir):**
- bookType: "fiction"
- targetWords: 70000
- Result: ~280 pages, 15-20 chapters

**For Quick Guide (Handbook, Playbook):**
- bookType: "handbook"
- targetWords: 20000
- Result: ~80 pages, 8-10 chapters

## 🔧 Troubleshooting

**"API Key Invalid"**
→ Check environment variable is set correctly in n8n

**"Google Docs Access Denied"**
→ Make sure APIs are enabled in Google Cloud Console
→ Check service account permissions

**"Workflow Timeout"**
→ Reduce targetWords
→ Increase n8n execution timeout in settings

**"Content Not Generated"**
→ Check Gemini API rate limits (60 req/min free tier)
→ Wait and retry

## 💰 Cost

- Google Gemini: **FREE** (60 requests/min)
- Google Docs: **FREE**
- n8n: **FREE** (self-hosted) or $20/mo (cloud)

**Total: $0** for most users!

## ⏱️ Processing Time

- 20k words: ~5 minutes
- 40k words: ~10 minutes
- 70k words: ~20 minutes

## 📱 Next Steps After Generation

1. **Review** - Read through entire book
2. **Edit** - Improve flow, fix errors
3. **Images** - Add real images to replace placeholders
4. **Format** - Apply styles, fonts, spacing
5. **Cover** - Design book cover
6. **Export** - Download as PDF or EPUB
7. **Publish** - Amazon KDP, Gumroad, etc.

## 🎯 Pro Tips

1. **Be Specific**: Better topic = better content
   - ❌ "Marketing"
   - ✅ "Instagram Marketing for Small Business Owners in 2025"

2. **Edit the Outline**: After generation, you can modify chapter order

3. **Regenerate Sections**: Just run specific nodes again

4. **Save Templates**: Duplicate workflow for different book types

5. **Batch Generate**: Run multiple books with different topics

## 🌟 Example Topics That Work Great

- "Complete Guide to Keto Diet for Beginners"
- "Digital Marketing Mastery in 30 Days"
- "Python Programming from Zero to Hero"
- "The Art of Productivity: Time Management Secrets"
- "Cryptocurrency Investing for Smart Investors"
- "Yoga Practice Guide: 100 Essential Poses"
- "Starting a Successful Online Business"
- "Photography Fundamentals: From Amateur to Pro"

## 📞 Need Help?

1. Check n8n docs: https://docs.n8n.io
2. Gemini API docs: https://ai.google.dev/docs
3. Google Docs API: https://developers.google.com/docs

---

**Ready to write your book in minutes? Let's go! 📚✨**

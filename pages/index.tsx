import { useState } from 'react';

export default function Home() {
  const [bookTopic, setBookTopic] = useState('');
  const [bookType, setBookType] = useState('non-fiction');
  const [targetWords, setTargetWords] = useState('40000');
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!bookTopic || !authorName) {
      alert('Please fill in Book Title and Author Name');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTopic,
          bookType,
          targetWords: parseInt(targetWords),
          authorName,
          authorBio,
          includeImages: 'yes'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📚 AI Book Generator</h1>
        <p style={styles.subtitle}>Generate complete books in minutes with AI</p>

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Book Title / Topic *</label>
            <input
              type="text"
              placeholder="e.g., Digital Marketing Mastery"
              value={bookTopic}
              onChange={(e) => setBookTopic(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Book Type</label>
            <select
              value={bookType}
              onChange={(e) => setBookType(e.target.value)}
              style={styles.select}
            >
              <option value="non-fiction">Non-Fiction (How-To, Business, Self-Help)</option>
              <option value="fiction">Fiction (Novel, Story)</option>
              <option value="handbook">Quick Handbook / Guide</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Target Word Count</label>
            <select
              value={targetWords}
              onChange={(e) => setTargetWords(e.target.value)}
              style={styles.select}
            >
              <option value="15000">15,000 words (~60 pages) - Quick Guide</option>
              <option value="25000">25,000 words (~100 pages) - Short Book</option>
              <option value="40000">40,000 words (~160 pages) - Standard</option>
              <option value="60000">60,000 words (~240 pages) - Full Book</option>
              <option value="80000">80,000 words (~320 pages) - Long Novel</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Author Name *</label>
            <input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Author Bio</label>
            <textarea
              placeholder="Brief bio about you (optional)"
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              style={styles.textarea}
              rows={3}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? '⏳ Generating Book...' : '🚀 Generate Complete Book'}
          </button>

          {loading && (
            <div style={styles.progress}>
              <div style={styles.progressBar}></div>
              <p style={styles.progressText}>
                Creating your book with AI... This may take 5-15 minutes depending on length.
              </p>
            </div>
          )}

          {result && (
            <div style={styles.result}>
              <h2 style={styles.resultTitle}>✅ Book Generated Successfully!</h2>

              <div style={styles.resultCard}>
                <h3 style={styles.resultSubtitle}>📖 {result.bookTitle}</h3>
                <p style={styles.resultInfo}>By {result.authorName}</p>

                <a
                  href={result.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.docLink}
                >
                  🔗 Open Google Doc
                </a>

                <div style={styles.stats}>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Document ID:</span>
                    <code style={styles.code}>{result.documentId}</code>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Generated:</span>
                    <span>{new Date(result.completedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div style={styles.nextSteps}>
                  <h4 style={styles.nextStepsTitle}>📝 Next Steps:</h4>
                  <ol style={styles.nextStepsList}>
                    <li>Open the Google Doc above</li>
                    <li>Review and edit the content</li>
                    <li>Replace image placeholders with actual images</li>
                    <li>Format and style as needed</li>
                    <li>Export to PDF or publish!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.features}>
          <h3 style={styles.featuresTitle}>✨ What You Get:</h3>
          <div style={styles.featureGrid}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📄</span>
              <span>Complete Book Structure</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✍️</span>
              <span>AI-Generated Content</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🖼️</span>
              <span>Image Placeholders</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📑</span>
              <span>Table of Contents</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📚</span>
              <span>10-15 Full Chapters</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>💾</span>
              <span>Google Docs Format</span>
            </div>
          </div>
        </div>

        <div style={styles.info}>
          <h4 style={styles.infoTitle}>ℹ️ How It Works:</h4>
          <ol style={styles.infoList}>
            <li>Enter your book details above</li>
            <li>Click "Generate Complete Book"</li>
            <li>AI creates outline with chapters</li>
            <li>Generates full content for each section</li>
            <li>Formats everything in Google Docs</li>
            <li>You get a ready-to-edit book!</li>
          </ol>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>Powered by Google Gemini AI & Google Docs | Built with Next.js</p>
        <p style={styles.footerNote}>
          Note: This generates a foundation for your book. Human review and editing are essential for quality.
        </p>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '20px',
    padding: '3rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '3rem',
    margin: '0 0 0.5rem 0',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.2rem',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95rem'
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  select: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    background: 'white',
    cursor: 'pointer'
  },
  textarea: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    marginTop: '1rem'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none'
  },
  progress: {
    marginTop: '1rem',
    textAlign: 'center'
  },
  progressBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
    backgroundSize: '200% 100%',
    animation: 'progressAnim 1.5s linear infinite',
    borderRadius: '2px'
  },
  progressText: {
    marginTop: '1rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  result: {
    marginTop: '2rem',
    padding: '2rem',
    background: '#f8f9fa',
    borderRadius: '15px',
    border: '2px solid #667eea'
  },
  resultTitle: {
    margin: '0 0 1.5rem 0',
    color: '#333',
    textAlign: 'center'
  },
  resultCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '10px'
  },
  resultSubtitle: {
    margin: '0 0 0.5rem 0',
    color: '#667eea'
  },
  resultInfo: {
    color: '#666',
    marginBottom: '1rem'
  },
  docLink: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    background: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    marginBottom: '1rem'
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px'
  },
  stat: {
    display: 'flex',
    gap: '0.5rem',
    fontSize: '0.9rem'
  },
  statLabel: {
    fontWeight: '600',
    color: '#666'
  },
  code: {
    background: '#e0e0e0',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: 'monospace'
  },
  nextSteps: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: '#f0f7ff',
    borderRadius: '8px',
    borderLeft: '4px solid #667eea'
  },
  nextStepsTitle: {
    margin: '0 0 0.75rem 0',
    color: '#667eea'
  },
  nextStepsList: {
    margin: '0',
    paddingLeft: '1.5rem',
    color: '#333'
  },
  features: {
    marginTop: '3rem',
    padding: '2rem',
    background: '#f8f9fa',
    borderRadius: '15px'
  },
  featuresTitle: {
    margin: '0 0 1.5rem 0',
    textAlign: 'center',
    color: '#333'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: 'white',
    borderRadius: '8px',
    fontSize: '0.9rem'
  },
  featureIcon: {
    fontSize: '1.5rem'
  },
  info: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: '#fff9e6',
    borderRadius: '10px',
    borderLeft: '4px solid #ffc107'
  },
  infoTitle: {
    margin: '0 0 1rem 0',
    color: '#333'
  },
  infoList: {
    margin: '0',
    paddingLeft: '1.5rem',
    color: '#333',
    lineHeight: '1.8'
  },
  footer: {
    maxWidth: '800px',
    margin: '2rem auto 0',
    textAlign: 'center',
    color: 'white',
    fontSize: '0.9rem'
  },
  footerNote: {
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    opacity: 0.8
  }
};

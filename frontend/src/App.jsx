import React, { useRef, useState } from "react";
import {
  ArrowRight,
  Leaf,
  Search,
  Upload,
  CloudSun,
  Droplets,
  ShieldCheck,
  ScanLine,
  Sprout,
  History,
  Menu,
  X,
} from "lucide-react";

const API = "https://crop-guard-gamma.vercel.app/api/analyze";

const featureCards = [
  {
    icon: <Leaf />,
    title: "Crop Health Analysis",
    text: "Upload a crop image and receive AI-assisted analysis of visible symptoms.",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: <CloudSun />,
    title: "Environmental Intelligence",
    text: "Use temperature, humidity, rainfall and growth stage as supporting context.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: <ScanLine />,
    title: "Risk Assessment",
    text: "Understand whether a potential issue needs monitoring or timely attention.",
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: <Sprout />,
    title: "Sustainable Actions",
    text: "Get practical guidance designed to avoid unnecessary resource use.",
    image:
      "https://images.unsplash.com/photo-1523742816791-6d2b9f5b0c88?auto=format&fit=crop&w=900&q=80",
  },
];

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [growth, setGrowth] = useState("Fruiting");
  const [temperature, setTemperature] = useState(30);
  const [humidity, setHumidity] = useState(70);
  const [rainfall, setRainfall] = useState("Low");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const inputRef = useRef();

  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError("");
  };

  const analyze = async () => {
    if (!file) {
      setError("Please upload a crop image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const form = new FormData();
    form.append("image", file);
    form.append("growth_stage", growth);
    form.append("temperature", temperature);
    form.append("humidity", humidity);
    form.append("rainfall", rainfall);

    try {
      const response = await fetch(`${API}/api/analyze`, {
        method: "POST",
        body: form,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || "Analysis failed.");
      }

      setResult(payload);
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="nav">
        <a className="brand" href="#home">
          <span className="brand-mark"><Leaf size={22} /></span>
          <span>
            <strong>CropGuard</strong>
            <small>AI for a Greener Tomorrow</small>
          </span>
        </a>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>

        <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
          <a href="#home">Home</a>
          <a href="#solutions">Solutions</a>
          <a href="#technology">Technology</a>
          <a href="#analyze">Analyze</a>
          <a href="#impact">Impact</a>
          <a href="#responsible">Responsible AI</a>
        </nav>

        <a className="nav-cta" href="#analyze">Get Started <ArrowRight size={15} /></a>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="eyebrow"><Leaf size={14} /> AI-POWERED CROP HEALTH INTELLIGENCE</div>
            <h1>
              See the Problem.<br />
              <span>Protect the Harvest.</span>
            </h1>
            <p>
              CropGuard uses multimodal AI to identify crop-health risks,
              analyze visible symptoms and environmental conditions, and provide
              sustainable, actionable guidance.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#analyze">Analyze Your Crop <ArrowRight size={17} /></a>
              <a className="ghost-btn" href="#technology">See How It Works</a>
            </div>
          </div>

          <div className="insight-card">
            <div className="card-top">
              <span><Leaf size={15} /> Live Crop Insight</span>
              <em>● AI</em>
            </div>
            {preview ? <img src={preview} alt="Uploaded crop" /> : <div className="mini-leaf"><Leaf /></div>}
            <strong>{result?.data?.crop || "Sample Crop"}</strong>
            <p>{result?.data?.possible_issue || "AI Insight Preview"}</p>
            <div className="risk-pill">{result?.data?.risk_level || "AI READY"}</div>
            <div className="mini-stats">
              <span>🌡 {temperature}°C<br /><small>Temperature</small></span>
              <span>💧 {humidity}%<br /><small>Humidity</small></span>
              <span>🌧 {rainfall}<br /><small>Rainfall</small></span>
            </div>
          </div>

          <div className="hero-stats">
            <span><Leaf /> <b>Multimodal</b><small>AI Analysis</small></span>
            <span><ScanLine /> <b>Image + Data</b><small>Crop Context</small></span>
            <span><Sprout /> <b>Targeted</b><small>Action Guidance</small></span>
            <span><Droplets /> <b>Sustainable</b><small>Resource Focus</small></span>
          </div>
        </section>

        <section id="solutions" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT WE DO</span>
              <h2>Intelligent Crop Health<br />for Smarter Farming</h2>
            </div>
            <p>
              Combine crop imagery and environmental context to understand
              potential crop-health risks and make more informed decisions.
            </p>
          </div>

          <div className="feature-grid">
            {featureCards.map((card) => (
              <article className="feature-card" key={card.title} style={{ backgroundImage: `url(${card.image})` }}>
                <div className="feature-shade" />
                <div className="feature-content">
                  <div className="icon-circle">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className="round-arrow"><ArrowRight size={16} /></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="technology" className="split-section">
          <div className="scan-visual">
            <img
              src={preview || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=85"}
              alt="Crop analysis"
            />
            <div className="scan-frame"><span /><span /><span /><span /></div>
            <div className="scan-badge"><ScanLine size={15} /> {loading ? "Analyzing..." : "AI Vision Ready"}</div>
          </div>
          <div className="split-copy">
            <span className="eyebrow">OUR TECHNOLOGY</span>
            <h2>From Image<br />to Insight.</h2>
            <p>
              Upload a crop image. CropGuard identifies the crop, analyzes
              visible symptoms, considers environmental context and suggests
              sustainable actions.
            </p>
            <div className="pipeline">
              {["Image Understanding", "Crop Identification", "Symptom Analysis", "Risk Assessment", "Sustainable Action"].map((x, i) => (
                <div className="pipeline-row" key={x}>
                  <b>0{i + 1}</b><span>{x}</span>{i < 4 && <ArrowRight size={14} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="analyze" className="section analyze-section">
          <div className="section-heading center">
            <span className="eyebrow">AI CROP ANALYSIS</span>
            <h2>Analyze Your Crop</h2>
            <p>Upload an image and add environmental details to get an AI-assisted assessment.</p>
          </div>

          <div className="analyze-panel">
            <div className="upload-box" onClick={() => inputRef.current?.click()}>
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <>
                  <div className="upload-icon"><Upload /></div>
                  <h3>Drop your crop image here</h3>
                  <p>or click to upload</p>
                  <small>JPG, JPEG or PNG • Max 10MB</small>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>

            <div className="environment">
              <h3>Environmental Information</h3>
              <label>Growth Stage
                <select value={growth} onChange={(e) => setGrowth(e.target.value)}>
                  {["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity", "Unknown"].map(x => <option key={x}>{x}</option>)}
                </select>
              </label>
              <label>Temperature (°C)
                <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
              </label>
              <label>Humidity (%)
                <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} />
              </label>
              <label>Recent Rainfall
                <select value={rainfall} onChange={(e) => setRainfall(e.target.value)}>
                  {["Low", "Moderate", "High", "Unknown"].map(x => <option key={x}>{x}</option>)}
                </select>
              </label>
              <button className="primary-btn full" onClick={analyze} disabled={loading}>
                {loading ? "AI is analyzing..." : "Analyze with AI"} <ArrowRight size={17} />
              </button>
              {error && <div className="error">{error}</div>}
            </div>
          </div>
        </section>

        <section id="results" className="section results-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">AI ASSESSMENT</span>
              <h2>CropGuard AI Results</h2>
            </div>
            <ShieldCheck size={36} className="green-icon" />
          </div>

          <div className="results-grid">
            <div className="result-image">
              {preview ? <img src={preview} alt="Analyzed crop" /> : <div className="empty-result"><Leaf size={42} /><p>Your analyzed crop appears here.</p></div>}
            </div>

            <div className="result-main">
              <div className="result-title">
                <small>CROP IDENTIFICATION</small>
                <h3>{result?.data?.crop || "Awaiting analysis"}</h3>
                <span>{result?.data?.growth_stage_assessment || "Upload an image to begin"}</span>
              </div>
              <div className="result-risk">
                <small>RISK LEVEL</small>
                <strong className={(result?.data?.risk_level || "pending").toLowerCase()}>
                  {result?.data?.risk_level || "PENDING"}
                </strong>
                <p>{result?.data?.risk_reason || "AI assessment will appear after analysis."}</p>
              </div>
              <div className="result-card">
                <small>🦠 POSSIBLE ISSUE</small>
                <p>{result?.data?.possible_issue || "—"}</p>
              </div>
            </div>
          </div>

          {result && (
            <div className="detail-grid">
              <div className="detail-card"><h3>🔎 Visual Symptoms</h3><ul>{result.data.visual_symptoms?.map(x => <li key={x}>{x}</li>)}</ul></div>
              <div className="detail-card"><h3>🛠 Recommended Actions</h3><ul>{result.data.recommended_actions?.map(x => <li key={x}>{x}</li>)}</ul></div>
              <div className="detail-card sustainable"><h3>♻ Sustainable Approach</h3><ul>{result.data.sustainable_approach?.map(x => <li key={x}>{x}</li>)}</ul></div>
              <div className="detail-card"><h3>👨‍🌾 When to Seek Expert Help</h3><p>{result.data.expert_help}</p></div>
              <div className="detail-card full-card"><h3>🔬 AI Limitations</h3><ul>{result.data.ai_limitations?.map(x => <li key={x}>{x}</li>)}</ul></div>
            </div>
          )}
        </section>

        <section id="responsible" className="section responsible">
          <div className="section-heading center">
            <span className="eyebrow">RESPONSIBLE AI</span>
            <h2>AI With Responsibility</h2>
            <p>Designed as preliminary decision support with transparency, privacy and human oversight.</p>
          </div>
          <div className="responsible-grid">
            <div><ShieldCheck /><h3>Fairness</h3><p>Avoid assumptions that one visual pattern applies equally across crops and environments.</p></div>
            <div><Search /><h3>Transparency</h3><p>Explain the visual evidence behind possible issues.</p></div>
            <div><History /><h3>Privacy</h3><p>Avoid collecting unnecessary personal or sensitive information.</p></div>
            <div><Leaf /><h3>Human Oversight</h3><p>AI output is preliminary and does not replace agricultural experts.</p></div>
          </div>
        </section>

        <section id="impact" className="impact">
          <div className="impact-overlay" />
          <div className="impact-content">
            <span className="eyebrow">OUR IMPACT</span>
            <h2>Towards a More<br />Sustainable Future</h2>
            <p>Earlier awareness → Better decisions → Targeted intervention → More responsible resource use.</p>
            <a className="primary-btn" href="#analyze">Start an Analysis <ArrowRight size={17} /></a>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark"><Leaf size={22} /></span><span><strong>CropGuard</strong><small>AI for a Greener Tomorrow</small></span></div>
        <div className="footer-links"><a href="#home">Home</a><a href="#analyze">Analyze</a><a href="#technology">Technology</a><a href="#responsible">Responsible AI</a></div>
        <small>Built for a more sustainable tomorrow.</small>
      </footer>
    </div>
  );
}

export default App;

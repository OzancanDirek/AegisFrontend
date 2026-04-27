const aegisstyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Inter:wght@400;500&display=swap');

  html, body, #root {
    margin: 0;
    padding: 0;
    background: #0c0912;
    min-height: 100vh;
  }

  .ag-page {
    min-height: 100vh;
    background: #0c0912;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    padding: 1.5rem;
  }

  .ag-grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(196,164,74,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(196,164,74,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .ag-card {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    max-width: 880px;
    min-height: 520px;
    border-radius: 18px;
    overflow: hidden;
    border: 0.5px solid #2a1f3d;
    animation: agFadeUp 0.5s ease both;
  }

  @keyframes agFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ag-left {
    flex: 1;
    background: #0f0c18;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .ag-left::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 280px; height: 280px;
    border-radius: 50%;
    border: 1px solid rgba(196,164,74,0.13);
    pointer-events: none;
  }

  .ag-left::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    border: 1px solid rgba(196,164,74,0.24);
    pointer-events: none;
  }

  .ag-logo-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 2.75rem;
  }

  .ag-wordmark {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #f5f0ff;
    letter-spacing: 3px;
  }

  .ag-badge {
    display: inline-block;
    background: rgba(196,164,74,0.1);
    border: 0.5px solid rgba(196,164,74,0.3);
    border-radius: 6px;
    padding: 4px 12px;
    margin-bottom: 14px;
  }

  .ag-badge span {
    font-size: 10px;
    color: #C4A44A;
    letter-spacing: 1.2px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
  }

  .ag-left h1 {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #f5f0ff;
    line-height: 1.4;
    margin: 0 0 10px;
  }

  .ag-left p {
    font-size: 13px;
    color: #9b8fc0;
    line-height: 1.75;
    margin: 0;
  }

  .ag-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 1.5rem;
  }

  .ag-feat {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ag-feat-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #C4A44A;
    flex-shrink: 0;
  }

  .ag-feat span {
    font-size: 12px;
    color: #7a6a9a;
  }

  .ag-copyright {
    font-size: 11px;
    color: #3d2f55;
  }

  .ag-divider {
    width: 0.5px;
    background: #221840;
  }

  .ag-right {
    width: 360px;
    background: #0c0912;
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .ag-right h2 {
    font-family: 'Syne', sans-serif;
    font-size: 21px;
    font-weight: 700;
    color: #f5f0ff;
    margin: 0 0 6px;
  }

  .ag-subtitle {
    font-size: 13px;
    color: #6b5d8a;
    margin: 0 0 1.75rem;
  }

  .ag-field {
    margin-bottom: 1rem;
  }

  .ag-field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .ag-label {
    font-size: 11px;
    color: #8070a8;
    letter-spacing: 0.6px;
  }

  .ag-forgot {
    font-size: 11px;
    color: #C4A44A;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: 'Inter', sans-serif;
    transition: opacity 0.2s;
  }
  .ag-forgot:hover { opacity: 0.7; }

  .ag-input-wrap {
    position: relative;
    height: 42px;
  }

  .ag-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .ag-input-wrap input {
    width: 100%;
    height: 100%;
    background: #0f0c18;
    border: 0.5px solid #2a1f3d;
    border-radius: 9px;
    padding: 0 12px 0 36px;
    font-size: 13px;
    color: #c8bfe8;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .ag-input-wrap input::placeholder { color: #3d2f55; }
  .ag-input-wrap input:focus { border-color: rgba(196,164,74,0.4); }
  .ag-input-wrap.has-toggle input { padding-right: 38px; }

  .ag-toggle-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
  }

  .ag-remember {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0.25rem 0 1.5rem;
    cursor: pointer;
  }

  .ag-checkbox {
    width: 17px;
    height: 17px;
    border: 0.5px solid rgba(196,164,74,0.35);
    border-radius: 4px;
    background: rgba(196,164,74,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ag-remember span {
    font-size: 12px;
    color: #6b5d8a;
  }

  .ag-btn-login {
    width: 100%;
    height: 44px;
    background: #C4A44A;
    border: none;
    border-radius: 9px;
    color: #0c0912;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    letter-spacing: 0.5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 1.25rem;
    transition: background 0.2s, transform 0.1s;
  }
  .ag-btn-login:hover { background: #b8943e; }
  .ag-btn-login:active { transform: scale(0.98); }
  .ag-btn-login:disabled {
    background: #6b5530;
    cursor: not-allowed;
    transform: none;
  }

  .ag-hint {
    font-size: 12px;
    color: #3d2f55;
    text-align: center;
  }

  .ag-hint button {
    color: #C4A44A;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    padding: 0;
    transition: opacity 0.2s;
  }
  .ag-hint button:hover { opacity: 0.7; }

  .ag-error {
    font-size: 12px;
    color: #e07070;
    background: rgba(224,112,112,0.08);
    border: 0.5px solid rgba(224,112,112,0.2);
    border-radius: 7px;
    padding: 8px 12px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .ag-success {
    font-size: 12px;
    color: #70c49a;
    background: rgba(112,196,154,0.08);
    border: 0.5px solid rgba(112,196,154,0.2);
    border-radius: 7px;
    padding: 8px 12px;
    margin-bottom: 1rem;
    text-align: center;
  }

  @media (max-width: 640px) {
    .ag-card { flex-direction: column; }
    .ag-left { padding: 2rem; }
    .ag-right { width: 100%; padding: 2rem; }
    .ag-divider { width: 100%; height: 0.5px; }
  }
`;

export default aegisstyle;
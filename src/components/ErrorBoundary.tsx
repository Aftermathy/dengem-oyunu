import { Component, ErrorInfo, ReactNode } from 'react';
import { reportError } from '@/lib/analytics';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, `componentStack: ${info.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100dvh',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            background: '#0f0f0f',
            color: '#f0f0f0',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Bir Hata Oluştu / Something Went Wrong
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#aaa', maxWidth: '320px', lineHeight: 1.6, marginBottom: '2rem' }}>
            Uygulama beklenmedik bir hatayla karşılaştı. Lütfen yeniden başlatın.
            <br />
            The app encountered an unexpected error. Please restart.
          </p>
          {this.state.error && (
            <pre
              style={{
                fontSize: '0.7rem',
                color: '#ff6b6b',
                background: '#1a1a1a',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                maxWidth: '320px',
                overflow: 'auto',
                marginBottom: '2rem',
                textAlign: 'left',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '12px',
              border: 'none',
              background: '#c0392b',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Yeniden Başlat / Restart
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function testConnection() {
      if (!supabase) {
        setStatus('error');
        console.error('Supabase client not initialized. Check your environment variables.');
        return;
      }
      try {
        const { data, error } = await supabase
          .from('connection_test')
          .select('test_message')
          .single();

        if (error) throw error;
        setStatus('success');
        setMessage(data?.test_message || 'Connected!');
      } catch (err) {
        console.error('Connection error:', err);
        setStatus('error');
      }
    }
    testConnection();
  }, []);

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      position: 'relative',
      padding: '2rem'
    }}>
      {/* Background Decorative Elements */}
      <div className="hero-glow" style={{ top: '10%', left: '10%' }}></div>
      <div className="hero-glow" style={{ bottom: '10%', right: '10%', background: 'var(--secondary-glow)' }}></div>

      {/* Navbar */}
      <nav className="glass" style={{
        position: 'fixed',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 3rem)',
        maxWidth: '1200px',
        height: '4.5rem',
        borderRadius: '2.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 100
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
          FER<span className="gradient-text">FE</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 500, fontSize: '0.9rem' }}>
          <a href="#" style={{ opacity: 0.8 }}>Features</a>
          <a href="#" style={{ opacity: 0.8 }}>Solutions</a>
          <a href="#" style={{ opacity: 0.8 }}>Pricing</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="glass" style={{
            padding: '0.4rem 1rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : '#f59e0b',
              boxShadow: `0 0 10px ${status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : '#f59e0b'}`
            }}></span>
            Supabase: {status === 'testing' ? 'Testing...' : status === 'success' ? 'Connected' : 'Error'}
          </div>
          <button className="glass" style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '1.5rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        marginTop: '10rem',
        textAlign: 'center',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div className="glass" style={{
          padding: '0.5rem 1rem',
          borderRadius: '2rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '1rem',
          color: 'var(--primary)'
        }}>
          ✨ {status === 'success' ? message : 'Next.js 15 + Premium UI'}
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.05em',
          fontWeight: 800,
          margin: 0
        }}>
          Build the <span className="gradient-text">Future</span> of <br /> Web Development
        </h1>

        <p style={{
          fontSize: '1.25rem',
          lineHeight: 1.6,
          opacity: 0.7,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Create stunning, high-performance applications with our modern tech stack.
          Seamlessly integrated, breathtakingly fast.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button style={{
            padding: '1rem 2.5rem',
            borderRadius: '3rem',
            background: 'white',
            color: 'black',
            fontWeight: 700,
            fontSize: '1.1rem',
            border: 'none',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}>
            Explore Now
          </button>
          <button className="glass" style={{
            padding: '1rem 2.5rem',
            borderRadius: '3rem',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'inherit',
            cursor: 'pointer'
          }}>
            Live Demo
          </button>
        </div>
      </section>

      {/* Floating Card Example */}
      <div className="animate-float" style={{
        marginTop: '6rem',
        maxWidth: '1000px',
        width: '100%'
      }}>
        <div className="glass" style={{
          borderRadius: '2rem',
          padding: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              padding: '2rem',
              borderRadius: '1.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '1rem',
                background: 'var(--primary)',
                marginBottom: '1.5rem'
              }}></div>
              <h3 style={{ marginBottom: '1rem' }}>Feature {i}</h3>
              <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '8rem',
        padding: '4rem 0',
        width: '100%',
        borderTop: '1px solid var(--glass-border)',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: '0.9rem'
      }}>
        © 2026 FER-FE. Built with Passion & Antigravity.
      </footer>
    </main>
  );
}

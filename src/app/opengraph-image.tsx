import { ImageResponse } from 'next/og';

// Route segment config
// ImageResponse works in Node.js runtime (Next.js 14+), no need for edge runtime
export const alt = 'vivahavedi - Find Your Perfect Life Partner | Indian Matrimonial Site';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(to bottom right, #fef2f2, #ffffff, #fce7f3)',
        }}
      >
        {/* Background Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(220, 38, 38, 0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(236, 72, 153, 0.1)',
            display: 'flex',
          }}
        />

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          {/* Logo/Brand Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #dc2626, #ec4899)',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'flex',
              }}
            >
              vivahavedi
            </div>
          </div>

          {/* Main Heading */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px',
              lineHeight: 1.2,
              maxWidth: '900px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ display: 'flex' }}>Find Your Perfect</span>
            <span style={{ display: 'flex' }}>Life Partner</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#6b7280',
              marginBottom: '40px',
              maxWidth: '800px',
              display: 'flex',
            }}
          >
            India&apos;s Most Trusted Matrimonial Platform
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '60px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  display: 'flex',
                }}
              >
                10M+
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#9ca3af',
                  display: 'flex',
                }}
              >
                Verified Profiles
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  display: 'flex',
                }}
              >
                50K+
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#9ca3af',
                  display: 'flex',
                }}
              >
                Success Stories
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  display: 'flex',
                }}
              >
                15+
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#9ca3af',
                  display: 'flex',
                }}
              >
                Years of Trust
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            padding: '16px 32px',
            borderRadius: '50px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#dc2626',
              display: 'flex',
            }}
          >
            Register Free • Find Your Match Today
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

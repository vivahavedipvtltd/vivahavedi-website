/**
 * Report Profile API
 *
 * API endpoints for reporting user profiles
 * Base URL: http://127.0.0.1:8000/api
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ReportProfileResponse {
  status: 'success' | 'failed' | 'error';
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

/**
 * Report Type Codes
 *
 * 1: Fake profile
 * 2: Inappropriate content
 * 3: Spam
 * 4: Other violations
 */
export enum ReportType {
  FAKE_PROFILE = 1,
  INAPPROPRIATE_CONTENT = 2,
  SPAM = 3,
  OTHER = 4,
}

export const REPORT_REASONS = [
  { value: ReportType.FAKE_PROFILE, label: 'Fake Profile' },
  { value: ReportType.INAPPROPRIATE_CONTENT, label: 'Inappropriate Content' },
  { value: ReportType.SPAM, label: 'Spam or Scam' },
  { value: ReportType.OTHER, label: 'Other Violations' },
];

/**
 * Report a user profile
 *
 * @param token - Authentication token
 * @param matchId - ID of the profile to report
 * @param reportType - Type/reason code for the report (1-4)
 * @returns Promise with report response
 */
export async function reportProfile(
  token: string,
  matchId: number,
  reportType: number
): Promise<ReportProfileResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/report-profile`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        match_id: matchId,
        report_type: reportType,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Report profile error:', error);
    return {
      status: 'error',
      message: 'Failed to report profile. Please try again.',
    };
  }
}

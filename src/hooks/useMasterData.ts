'use client';

import useSWR from 'swr';
import { buildApiUrl, staticDataConfig } from '@/lib/swrConfig';
import type { MasterDataResponse, LocationsResponse } from '@/lib/masterApi';

/**
 * Hook to fetch and cache master data (religions, castes, countries, etc.)
 * Data is cached for 1 hour and shared across all components
 *
 * @returns {object} Master data, loading state, and error
 *
 * @example
 * const { data, isLoading, error } = useMasterData();
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error loading data</div>;
 * // Use data.data.religion, data.data.caste, etc.
 */
export function useMasterData() {
  const { data, error, isLoading } = useSWR<MasterDataResponse>(
    buildApiUrl('/masters'),
    staticDataConfig
  );

  return {
    data,
    isLoading,
    error,
    // Helper to check if data is available
    hasData: !isLoading && !error && data?.status === 'success',
  };
}

/**
 * Hook to fetch locations by district ID with caching
 *
 * @param districtId - The district ID to fetch locations for
 * @returns {object} Location data, loading state, and error
 *
 * @example
 * const { data, isLoading } = useLocationsByDistrict(5);
 */
export function useLocationsByDistrict(districtId: number | null) {
  const { data, error, isLoading } = useSWR<LocationsResponse>(
    districtId ? buildApiUrl(`/masters/locations?district_id=${districtId}`) : null,
    staticDataConfig
  );

  return {
    data,
    isLoading,
    error,
    hasData: !isLoading && !error && data?.status === 'success',
  };
}

/**
 * Legacy compatibility function - wraps useMasterData for non-hook usage
 * Use this when you need to fetch master data outside of React components
 * For React components, use useMasterData() hook instead
 */
export async function getMasterDataLegacy(): Promise<MasterDataResponse> {
  const response = await fetch(buildApiUrl('/masters'), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

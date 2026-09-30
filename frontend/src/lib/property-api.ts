import 'server-only';
import { fetchProperties, fetchProperty, recordPropertyView, type PropertyConnection } from './property-client';

export function propertyConnection(): PropertyConnection {
  const source = process.env.PROPERTY_SOURCE ?? 'legacy';
  if (source === 'dashboard') {
    if (!process.env.PROPERTY_API_URL || !process.env.PROPERTY_API_KEY) throw new Error('Property connection is not configured');
    return { source, baseUrl: process.env.PROPERTY_API_URL, apiKey: process.env.PROPERTY_API_KEY };
  }
  if (source !== 'legacy') throw new Error('Unknown PROPERTY_SOURCE');
  return { source, baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000' };
}
export function getProperties() { return fetchProperties(propertyConnection()); }
export function getProperty(id: string) { return fetchProperty(propertyConnection(), id); }
export function incrementViews(id: string) { return recordPropertyView(propertyConnection(), id); }

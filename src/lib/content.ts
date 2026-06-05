import policiesData from '../content/policies.json';
import competitionsData from '../content/competitions.json';
import admissionsData from '../content/admissions.json';
import districtsData from '../content/districts.json';
import tagsData from '../data/tags.json';
import categoriesData from '../data/categories.json';
import type { ContentItem, PolicyItem, CompetitionItem, AdmissionItem, DistrictItem } from './schema';

// Base URL helper - pass from templates via Astro.glob or import.meta.env
export function url(path: string, base?: string): string {
  const b = (base || '').replace(/\/$/, '');
  if (!b) return path;
  return b + path;
}

// ===== Type loaders =====
export function getPolicies(): PolicyItem[] {
  return policiesData as PolicyItem[];
}

export function getCompetitions(): CompetitionItem[] {
  return competitionsData as CompetitionItem[];
}

export function getAdmissions(): AdmissionItem[] {
  return admissionsData as AdmissionItem[];
}

export function getDistricts(): DistrictItem[] {
  return districtsData as DistrictItem[];
}

export function getAllContent(): ContentItem[] {
  return [
    ...getPolicies(),
    ...getCompetitions(),
    ...getAdmissions(),
    ...getDistricts(),
  ];
}

// ===== Single item lookup =====
export function getItemBySlug(type: string, slug: string): ContentItem | undefined {
  switch (type) {
    case 'policies': return getPolicies().find(i => i.slug === slug);
    case 'competitions': return getCompetitions().find(i => i.slug === slug);
    case 'admissions': return getAdmissions().find(i => i.slug === slug);
    case 'districts': return getDistricts().find(i => i.slug === slug);
    default: return undefined;
  }
}

// ===== Tags =====
export function getTags() {
  return tagsData;
}

export function getTagColor(tagId: string): string {
  const tag = tagsData.find(t => t.id === tagId);
  return tag?.color ?? '#636e72';
}

// ===== Categories =====
export function getCategories() {
  return categoriesData;
}

export function getCategoryInfo(catKey: string) {
  return (categoriesData as Record<string, { label: string; icon: string; description: string; color: string; bgColor: string; order: number }>)[catKey];
}

// ===== Counts =====
export function getContentCounts(): Record<string, number> {
  return {
    policies: getPolicies().length,
    competitions: getCompetitions().length,
    admissions: getAdmissions().length,
    districts: getDistricts().length,
    total: getAllContent().length,
  };
}

// ===== Recent items =====
export function getRecentItems(count: number = 5): ContentItem[] {
  return getAllContent()
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, count);
}

// ===== Related items =====
export function getRelatedItems(item: ContentItem, max: number = 4): ContentItem[] {
  const all = getAllContent().filter(i => i.id !== item.id);
  const scored = all.map(i => {
    const sharedTags = i.tags.filter(t => item.tags.includes(t)).length;
    const sameCategory = i.category === item.category ? 1 : 0;
    return { item: i, score: sharedTags * 2 + sameCategory };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(s => s.item);
}

// ===== Items by tag =====
export function getItemsByTag(tagId: string): ContentItem[] {
  return getAllContent().filter(i => i.tags.includes(tagId));
}

// ===== Utility for finding items across categories =====
export function getCategoryItems(category: string): ContentItem[] {
  switch (category) {
    case 'policies': return getPolicies();
    case 'competitions': return getCompetitions();
    case 'admissions': return getAdmissions();
    case 'districts': return getDistricts();
    default: return [];
  }
}

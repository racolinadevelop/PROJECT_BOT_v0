import mockProducts from '@/mocks/products.json';
import { Product } from './types';

export async function getProductsByBranch(branch: string): Promise<Product[]> {
  await new Promise(r => setTimeout(r, 150));
  return (mockProducts as Product[]).filter(p => p.branchId === branch && p.isActive);
}

export async function getProductBySlug(branch: string, slug: string): Promise<Product | null> {
  await new Promise(r => setTimeout(r, 100));
  return (mockProducts as Product[]).find(p => p.branchId === branch && p.slug === slug) ?? null;
}
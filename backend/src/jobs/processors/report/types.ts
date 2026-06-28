export const FETCH_BATCH_SIZE = 500;

export interface ReportFilters {
  search?: string;
  categoryName?: string;
  sortBy?: string;
  sortOrder?: string;
}
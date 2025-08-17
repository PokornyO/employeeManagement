export interface PaginatedResponse {
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
    isFirst: boolean;
    isLast: boolean;
}
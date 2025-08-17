import React, { useEffect, useState } from "react";
import { Pagination, Box, Typography } from "@mui/material";
import { useTheme } from "styled-components";
import Loading from "../loading/Loading.tsx";
import locale from "../../locale/cs.json";

interface PaginatedListProps<T> {
    fetchData: (page: number, size: number) => Promise<{ items: T[]; totalPages: number }>;
    renderItem: (
        item: T,
        actions: { onUpdate: (updatedItem: T) => void; onDelete: (id: number) => void }
    ) => React.ReactNode;
    pageSize: number;
    sx?: object;
    onUpdateItem?: (updatedItem: T) => void;
    onDeleteItem?: (id: number) => void;
    refreshKey?: number;
}

const PaginatedList = <T extends { id: number }>({
     fetchData,
     renderItem,
     pageSize,
     sx,
     onUpdateItem,
     onDeleteItem,
     refreshKey,
}: PaginatedListProps<T>) => {
    const theme = useTheme();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPage = async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchData(page, pageSize);
            const { items, totalPages } = response;
            setTotalPages(totalPages);

            if (totalPages > 0 && page >= totalPages) {
                setCurrentPage(totalPages - 1);
            } else {
                setItems(items);
            }
        } catch (err) {
            setError(locale.ERROR_FETCHING_DATA);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadPage(currentPage);
    }, [currentPage, refreshKey]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page - 1);
    };

    const handleUpdateItem = (updatedItem: T) => {
        setItems((prevItems) => prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
        if (onUpdateItem) onUpdateItem(updatedItem);
    };

    const handleDeleteItem = (id: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        if (onDeleteItem) onDeleteItem(id);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    if (items.length === 0) {
        return (
            <Typography color="gray" align="center">
                {locale.EMPTY_LIST}
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: 2, ...sx }}>
            {items.map((item) =>
                renderItem(item, {
                    onUpdate: handleUpdateItem,
                    onDelete: handleDeleteItem,
                })
            )}
            <Pagination
                count={totalPages === 0 ? 1 : totalPages}
                page={currentPage + 1}
                onChange={handlePageChange}
                sx={{
                    justifyContent: { xs: "center", sm: "flex-start" },
                    display: "flex",
                    mt: 2,
                    "& .MuiPaginationItem-root": {
                        color: theme.text,
                        "&.Mui-selected": {
                            backgroundColor: theme.primary,
                            color: theme.text,
                        },
                        "&:hover": {
                            backgroundColor: theme.primaryLight,
                        },
                    },
                }}
            />
        </Box>
    );
};

export default PaginatedList;
